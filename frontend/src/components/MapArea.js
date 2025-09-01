import React, { useContext } from 'react';
import { ModuleContext } from '../context/ModuleContext';

const MapArea = () => {
  const { selectedModule, openCharacterSheet } = useContext(ModuleContext);

  return (
    <div className="map-area" style={{
      gridArea: 'main',
      backgroundColor: '#e9e9e9',
      border: '1px solid #ccc',
      padding: '10px'
    }}>
      {selectedModule ? (
        <button onClick={openCharacterSheet}>Show Character Sheet</button>
      ) : (
        <p>Select a module to see its character sheet.</p>
      )}
    </div>
  );
};

export default MapArea;
