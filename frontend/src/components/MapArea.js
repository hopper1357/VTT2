import React, { useContext } from 'react';
import { ModuleContext } from '../context/ModuleContext';
import Modal from './Modal';

const MapArea = () => {
  const { selectedModule, loadedComponents, isSheetOpen, toggleSheet } = useContext(ModuleContext);

  const CharacterSheet = selectedModule
    ? loadedComponents[selectedModule.id]?.CharacterSheet
    : null;

  return (
    <div className="map-area" style={{
      gridArea: 'main',
      backgroundColor: '#e9e9e9',
      border: '1px solid #ccc',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p>This is the main map area. The character sheet will open in a modal.</p>

      <Modal isOpen={isSheetOpen} onClose={() => toggleSheet(false)}>
        {CharacterSheet ? (
          <CharacterSheet />
        ) : (
          <p>Loading character sheet...</p>
        )}
      </Modal>
    </div>
  );
};

export default MapArea;
