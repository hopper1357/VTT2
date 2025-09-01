import React, { createContext, useState, useCallback } from 'react';

export const ModuleContext = createContext();

export const ModuleProvider = ({ children }) => {
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);

    const fetchModules = useCallback(async () => {
        try {
            // In development, the React server is on a different port,
            // so we need to use the full URL to the backend.
            const response = await fetch('http://localhost:8000/api/modules');
            if (!response.ok) {
                throw new Error(`Failed to fetch modules: ${response.statusText}`);
            }
            const data = await response.json();
            setModules(data);
            console.log("Fetched modules:", data);
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    }, []); // Empty dependency array means this is created once

    const selectModule = useCallback((moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        if (module) {
            setSelectedModule(module);
            console.log("Selected module:", module);
        } else {
            console.error(`Module with id ${moduleId} not found.`);
        }
    }, [modules]); // Re-create if modules list changes

    const value = {
        modules,
        selectedModule,
        fetchModules,
        selectModule
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
};
