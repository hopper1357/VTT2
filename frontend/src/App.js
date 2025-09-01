import React from 'react';
import './App.css';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import MapArea from './components/MapArea';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="vtt-container">
        <TopBar />
        <LeftPanel />
        <MapArea />
        <RightPanel />
        <BottomBar />
      </div>
    </DndProvider>
  );
}

export default App;
