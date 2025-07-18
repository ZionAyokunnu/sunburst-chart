// The core chart component
export { default as SunburstChart } from './sunburst';

// Your data context (fetches from Supabase under the hood)
export { useEcosystem, EcosystemProvider } from './context/EcosystemContext';

// Toast utilities
export { useToast, toast } from './context/use-toast';

// Utility to transform raw indicators → sunburst nodes & links
export { transformToSunburstData } from './utils/indicatorUtils';


// // Prepare sunburst data
//   const sunburstData = React.useMemo(() => {
//     if (coreIndicator && localIndicators.length > 0 && relationships.length > 0) {
//       return transformToSunburstData(localIndicators, relationships);
//     }
//     return { nodes: [], links: [] };
//   }, [coreIndicator, localIndicators, relationships]);