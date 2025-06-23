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
