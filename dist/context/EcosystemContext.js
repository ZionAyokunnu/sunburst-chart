import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { getIndicators, getRelationships } from '../types/api';
import { toast } from './use-toast';
const EcosystemContext = createContext(undefined);
export const EcosystemProvider = ({ children }) => {
    const [indicators, setIndicators] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            console.error('Error fetching ecosystem data:', err);
            setError(err);
            toast({
                title: "Error Loading Data",
                description: "There was a problem loading the ecosystem data.",
                variant: "destructive"
            });
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        // Initial data fetch
        refreshData();
    }, []);
    return (_jsx(EcosystemContext.Provider, { value: {
            indicators,
            relationships,
            loading,
            error,
            refreshData
        }, children: children }));
};
export const useEcosystem = () => {
    const context = useContext(EcosystemContext);
    if (context === undefined) {
        throw new Error('useEcosystem must be used within an EcosystemProvider');
    }
    return context;
};
