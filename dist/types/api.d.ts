import type { Indicator, Relationship } from '../types';
export declare const recordAdminIndicatorChange: ({ indicator_id, value, rationale, admin_id }: {
    indicator_id: string;
    value: number;
    rationale?: string;
    admin_id: string;
}) => Promise<{
    success: boolean;
    error?: any;
}>;
export declare const updateHistoricalValue: ({ indicator_id, year, value, rationale, admin_id }: {
    indicator_id: string;
    year: number;
    value: number;
    rationale?: string;
    admin_id: string;
}) => Promise<{
    success: boolean;
    error?: any;
}>;
export declare const getIndicators: () => Promise<Indicator[]>;
export declare const updateIndicatorValue: (indicator_id: string, new_value: number) => Promise<void>;
export declare const getIndicatorById: (indicator_id: string) => Promise<Indicator>;
export declare const getRelationships: () => Promise<Relationship[]>;
export declare const getChildrenByParentId: (parent_id: string) => Promise<Relationship[]>;
export declare const getParentsByChildId: (child_id: string) => Promise<Relationship[]>;
