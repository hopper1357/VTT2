import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleContext } from '../context/ModuleContext';
import CharacterSheetModal from './CharacterSheetModal';
import Modal from './Modal';

// Mock the Modal component to avoid dealing with portals in tests
jest.mock('./Modal', () => ({ children, onClose }) => (
  <div data-testid="modal">
    <button onClick={onClose}>Close</button>
    {children}
  </div>
));

describe('CharacterSheetModal', () => {
  const CharacterSheetComponent = () => <div>Mock Character Sheet</div>;

  it('renders nothing when isCharacterSheetVisible is false', () => {
    const contextValue = {
      isCharacterSheetVisible: false,
      selectedModule: { id: 'dnd5e' },
      loadedComponents: { dnd5e: { CharacterSheet: CharacterSheetComponent } },
      closeCharacterSheet: () => {},
    };

    const { container } = render(
      <ModuleContext.Provider value={contextValue}>
        <CharacterSheetModal />
      </ModuleContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders the character sheet when visible', () => {
    const contextValue = {
      isCharacterSheetVisible: true,
      selectedModule: { id: 'dnd5e' },
      loadedComponents: { dnd5e: { CharacterSheet: CharacterSheetComponent } },
      closeCharacterSheet: () => {},
    };

    render(
      <ModuleContext.Provider value={contextValue}>
        <CharacterSheetModal />
      </ModuleContext.Provider>
    );

    expect(screen.getByText('Mock Character Sheet')).toBeInTheDocument();
  });

  it('calls closeCharacterSheet when the close button is clicked', () => {
    const closeCharacterSheet = jest.fn();
    const contextValue = {
      isCharacterSheetVisible: true,
      selectedModule: { id: 'dnd5e' },
      loadedComponents: { dnd5e: { CharacterSheet: CharacterSheetComponent } },
      closeCharacterSheet,
    };

    render(
      <ModuleContext.Provider value={contextValue}>
        <CharacterSheetModal />
      </ModuleContext.Provider>
    );

    fireEvent.click(screen.getByText('Close'));
    expect(closeCharacterSheet).toHaveBeenCalledTimes(1);
  });
});
