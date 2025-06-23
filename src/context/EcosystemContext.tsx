
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Indicator, Relationship } from '../types';
import { getIndicators, getRelationships } from '../types/api';
import { toast } from './use-toast';

interface EcosystemContextProps {
  indicators: Indicator[];
  relationships: Relationship[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

const EcosystemContext = createContext<EcosystemContextProps | undefined>(undefined);

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [indicatorsData, relationshipsData] = await Promise.all([
        getIndicators(),
        getRelationships()
      ]);
      
      setIndicators(indicatorsData);
      setRelationships(relationshipsData);
    } catch (err) {
      console.error('Error fetching ecosystem data:', err);
      setError(err as Error);
      toast({
        title: "Error Loading Data",
        description: "There was a problem loading the ecosystem data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    
    // Initial data fetch
    refreshData();
  }, []);
  
  return (
    <EcosystemContext.Provider value={{
      indicators,
      relationships,
      loading,
      error,

      refreshData
    }}>
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (context === undefined) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
