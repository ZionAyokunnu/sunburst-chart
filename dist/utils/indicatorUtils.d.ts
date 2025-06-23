import { Indicator, Relationship } from '../types';
export declare const getColorByValue: (value: number) => string;
export declare const buildIndicatorTree: (rootId: string, indicators: Indicator[], relationships: Relationship[], maxDepth?: number, currentDepth?: number) => {
    nodes: Map<string, Indicator>;
    edges: Relationship[];
};
export declare const getParentChain: (indicatorId: string, indicators: Indicator[], relationships: Relationship[], visited?: Set<string>) => Indicator[];
export declare const transformToSunburstData: (indicators: Indicator[], relationships: Relationship[]) => {
    nodes: any[];
    links: any[];
};
export declare const calculateNetScore: (indicatorId: string, indicators: Indicator[], relationships: Relationship[]) => number;
