import React, { useEffect, useContext } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import MapArea from './components/MapArea';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameStateProvider, GameStateContext } from './context/GameStateContext';
import { ModuleProvider, ModuleContext } from './context/ModuleContext';
import websocketService from './services/websocket';

const AppContent = () => {
  const { handleServerEvent } = useContext(GameStateContext);
  const { fetchModules, registerComponents } = useContext(ModuleContext);

  // Effect to handle module component registration
  useEffect(() => {
    const handleModuleLoaded = (event) => {
      const { moduleId } = event.detail;
      const components = window[`${moduleId}_components`];
      if (components) {
        registerComponents(moduleId, components);
      }
    };

    window.addEventListener('module-loaded', handleModuleLoaded);
    return () => {
      window.removeEventListener('module-loaded', handleModuleLoaded);
    };
  }, [registerComponents]);

  // Effect for WebSocket connection
  useEffect(() => {
    // Define event handlers
    const onConnectionReady = (payload) => handleServerEvent('connection_ready', payload);
    const onPlayerJoin = (payload) => handleServerEvent('player_join', payload);
    const onPlayerLeave = (payload) => handleServerEvent('player_leave', payload);

    // Register event listeners
    websocketService.on('connection_ready', onConnectionReady);
    websocketService.on('player_join', onPlayerJoin);
    websocketService.on('player_leave', onPlayerLeave);

    // Connect to the server
    websocketService.connect();

    // Cleanup on component unmount
    return () => {
      console.log("Cleaning up WebSocket connection and listeners.");
      websocketService.off('connection_ready', onConnectionReady);
      websocketService.off('player_join', onPlayerJoin);
      websocketService.off('player_leave', onPlayerLeave);
      websocketService.disconnect();
    };
  }, [handleServerEvent]);

  // Effect for fetching modules
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <div className="vtt-container">
      <TopBar />
      <LeftPanel />
      <MapArea />
      <RightPanel />
      <BottomBar />
    </div>
  );
};

function App() {
  return (
    <ModuleProvider>
      <GameStateProvider>
        <DndProvider backend={HTML5Backend}>
          <AppContent />
        </DndProvider>
      </GameStateProvider>
    </ModuleProvider>
  );
}

export default App;
