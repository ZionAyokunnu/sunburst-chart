export interface SunburstNode {
  depth: number;
  id: string;
  name: string;
  value: number;
  color: string;
  category?: string;
  parentIds?: string[];
}

export interface SunburstLink {
  influence_score: number;
  influence_weight: number;
  parent_id: string;
  child_id: string;
  weight: number;
  correlation?: number;
}

export interface Indicator {
  indicator_id: string;
  name: string;
  current_value: number;
  category: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Relationship {
  relationship_id: string;
  parent_id: string;
  child_id: string;
  influence_weight: number;
  influence_score: number;
  created_at?: string;
  updated_at?: string;
  child_to_parent_weight?: number;
}