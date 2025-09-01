import React, { createContext, useState, useCallback } from 'react';
import { loadScript } from '../services/dynamicScriptLoader';

export const ModuleContext = createContext();

export const ModuleProvider = ({ children }) => {
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [loadedComponents, setLoadedComponents] = useState({});
    const [isCharacterSheetVisible, setCharacterSheetVisible] = useState(false);

    const openCharacterSheet = () => setCharacterSheetVisible(true);
    const closeCharacterSheet = () => setCharacterSheetVisible(false);

    const registerComponents = useCallback((moduleId, components) => {
        setLoadedComponents(prev => ({ ...prev, [moduleId]: components }));
        console.log(`Components for module ${moduleId} have been registered.`);
    }, []);

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

    const selectModule = useCallback(async (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        if (module) {
            setSelectedModule(module);
            console.log("Selected module:", module);

            const scriptUrl = `http://localhost:8000/modules/${module.id}/${module.entry_point}`;
            try {
                await loadScript(scriptUrl);
            } catch (error) {
                console.error(`Error loading module script for ${module.id}:`, error);
                // Optionally, deselect the module or show an error state
                setSelectedModule(null);
            }
        } else {
            console.error(`Module with id ${moduleId} not found.`);
        }
    }, [modules]); // Re-create if modules list changes

    const value = {
        modules,
        selectedModule,
        loadedComponents,
        fetchModules,
        selectModule,
        registerComponents,
        isCharacterSheetVisible,
        openCharacterSheet,
        closeCharacterSheet
    };

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
};
