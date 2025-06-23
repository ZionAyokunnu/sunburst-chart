import React, { useState } from 'react';
import { transformToSunburstData } from './utils/indicatorUtils';
import { Indicator } from './types';
  
  const [coreIndicator, setCoreIndicator] = useState<Indicator | null>(null);
  const [localIndicators, setLocalIndicators] = useState<Indicator[]>([]);
  const { indicators, relationships, loading, error, userSettings, refreshData } = useEcosystem();
    
    
    // Prepare sunburst data
    const sunburstData = React.useMemo(() => {
    if (coreIndicator && localIndicators.length > 0 && relationships.length > 0) {
      return transformToSunburstData(localIndicators, relationships);
    }
    return { nodes: [], links: [] };
  }, [coreIndicator, localIndicators, relationships]);


export { default as SunburstChart } from './sunburst';

function useEcosystem(): { indicators: any; relationships: any; loading: any; error: any; userSettings: any; refreshData: any; } {
    throw new Error('Function not implemented.');
}
