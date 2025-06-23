import React from 'react';
import { Indicator, Relationship } from '../types';
interface EcosystemContextProps {
    indicators: Indicator[];
    relationships: Relationship[];
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}
export declare const EcosystemProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useEcosystem: () => EcosystemContextProps;
export {};
