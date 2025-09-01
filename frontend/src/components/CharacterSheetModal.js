import React, { useContext } from 'react';
import Modal from './Modal';
import { ModuleContext } from '../context/ModuleContext';

const CharacterSheetModal = () => {
  const { selectedModule, loadedComponents, isCharacterSheetVisible, closeCharacterSheet } = useContext(ModuleContext);

  if (!isCharacterSheetVisible || !selectedModule) {
    return null;
  }

  const CharacterSheet = loadedComponents[selectedModule.id]?.CharacterSheet;

  if (!CharacterSheet) {
    return null;
  }

  return (
    <Modal onClose={closeCharacterSheet}>
      <CharacterSheet />
    </Modal>
  );
};

export default CharacterSheetModal;
