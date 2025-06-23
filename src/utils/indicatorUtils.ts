import { Indicator, Relationship} from '../types';

// Map indicator value to color gradient (0-100)
export const getColorByValue = (value: number): string => {
  // Red (low) -> Yellow (medium) -> Green (high)
  if (value <= 33) {
    // Red to Yellow gradient
    const ratio = value / 33;
    const r = 255;
    const g = Math.round(255 * ratio);
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  } else if (value <= 66) {
    // Yellow to Green gradient
    const ratio = (value - 33) / 33;
    const r = Math.round(255 * (1 - ratio));
    const g = 255;
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Green (with slight variation for better visualization)
    const ratio = (value - 66) / 34;
    const r = 0;
    const g = 255;
    const b = Math.round(100 * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

// Build indicator tree up to maxDepth from a root indicator
export const buildIndicatorTree = (
  rootId: string,
  indicators: Indicator[],
  relationships: Relationship[],
  maxDepth: number = 5,
  currentDepth: number = 0
): { nodes: Map<string, Indicator>, edges: Relationship[] } => {
  if (currentDepth >= maxDepth) {
    return { nodes: new Map(), edges: [] };
  }
  
  // Find all direct children of the root
  const childRelationships = relationships.filter(rel => rel.parent_id === rootId);
  const childIds = childRelationships.map(rel => rel.child_id);
  
  // Map of all nodes in this subtree
  const nodes = new Map<string, Indicator>();
  let edges: Relationship[] = [...childRelationships];
  
  // Add children to the node map
  childIds.forEach(childId => {
    const childIndicator = indicators.find(ind => ind.indicator_id === childId);
    if (childIndicator) {
      nodes.set(childId, childIndicator);
      
      // Recursively build the tree for each child
      const childTree = buildIndicatorTree(childId, indicators, relationships, maxDepth, currentDepth + 1);
      
      // Merge the child tree with the current tree
      childTree.nodes.forEach((value, key) => {
        nodes.set(key, value);
      });
      
      edges = [...edges, ...childTree.edges];
    }
  });
  
  return { nodes, edges };
};

// Get all parents of an indicator up to the root
export const getParentChain = (
  indicatorId: string,
  indicators: Indicator[],
  relationships: Relationship[],
  visited: Set<string> = new Set()
): Indicator[] => {
  // Prevent circular references
  if (visited.has(indicatorId)) {
    return [];
  }
  visited.add(indicatorId);
  
  // Find all direct parents
  const parentRelationships = relationships.filter(rel => rel.child_id === indicatorId);
  const parentIds = parentRelationships.map(rel => rel.parent_id);
  
  // Get parent indicators
  const parentIndicators = indicators.filter(ind => parentIds.includes(ind.indicator_id));
  
  // Recursively get ancestors
  const ancestors: Indicator[] = [];
  parentIndicators.forEach(parent => {
    ancestors.push(parent);
    const parentAncestors = getParentChain(parent.indicator_id, indicators, relationships, visited);
    ancestors.push(...parentAncestors);
  });
  
  return ancestors;
};

// Transform indicators and relationships to sunburst chart format
export const transformToSunburstData = (
  indicators: Indicator[],
  relationships: Relationship[]
): { nodes: any[], links: any[] } => {
  const nodes = indicators.map(indicator => ({
    id: indicator.indicator_id,
    name: indicator.name,
    value: indicator.current_value,
    category: indicator.category,
    color: getColorByValue(indicator.current_value)
  }));
  
  const links = relationships.map(relationship => ({
    parent_id: relationship.parent_id,
    child_id: relationship.child_id,
    weight: relationship.influence_weight,
    correlation: relationship.influence_score
  }));
  
  return { nodes, links };
};

// Calculate net score for an indicator based on correlation scores
export const calculateNetScore = (
  indicatorId: string,
  indicators: Indicator[],
  relationships: Relationship[]
): number => {
  const indicator = indicators.find(ind => ind.indicator_id === indicatorId);
  if (!indicator) return 0;
  
  // Find the self-relationship and all child relationships
  const selfRel = relationships.find(
    rel => rel.parent_id === indicatorId && rel.child_id === indicatorId
  );
  
  const childRels = relationships.filter(
    rel => rel.parent_id === indicatorId && rel.child_id !== indicatorId
  );
  
  // Calculate net score using correlation scores
  let netScore = 0;
  
  // Add self contribution (defaults to 0.1 or 10% if not found)
  if (selfRel) {
    netScore += selfRel.influence_score * indicator.current_value;
  }
  
  // Add children contributions
  childRels.forEach(rel => {
    const childIndicator = indicators.find(ind => ind.indicator_id === rel.child_id);
    if (childIndicator) {
      netScore += rel.influence_score * childIndicator.current_value;
    }
  });
  
  return netScore;
};
