import React from 'react';
import { SunburstNode, SunburstLink } from './types';
interface SunburstChartProps {
    nodes: SunburstNode[];
    links: SunburstLink[];
    width?: number;
    height?: number;
    onSelect?: (indicatorId: string) => void;
    maxLayers?: number;
    showLabels?: boolean;
    onBreadcrumbsChange?: (items: Array<{
        id: string;
        name: string;
    }>) => void;
    onVisibleNodesChange?: (visible: SunburstNode[]) => void;
    onCoreChange?: (id: string | null) => void;
    fixedMode?: boolean;
}
declare const SunburstChart: React.FC<SunburstChartProps>;
export default SunburstChart;
