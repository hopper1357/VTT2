import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleContext } from '../context/ModuleContext';
import MapArea from './MapArea';

describe('MapArea', () => {
  it('renders a button to show character sheet when a module is selected', () => {
    const openCharacterSheet = jest.fn();
    const contextValue = {
      selectedModule: { id: 'dnd5e', name: 'D&D 5e' },
      openCharacterSheet,
    };

    render(
      <ModuleContext.Provider value={contextValue}>
        <MapArea />
      </ModuleContext.Provider>
    );

    const button = screen.getByText(/show character sheet/i);
    expect(button).toBeInTheDocument();
  });

  it('calls openCharacterSheet when the button is clicked', () => {
    const openCharacterSheet = jest.fn();
    const contextValue = {
      selectedModule: { id: 'dnd5e', name: 'D&D 5e' },
      openCharacterSheet,
    };

    render(
      <ModuleContext.Provider value={contextValue}>
        <MapArea />
      </ModuleContext.Provider>
    );

    const button = screen.getByText(/show character sheet/i);
    fireEvent.click(button);
    expect(openCharacterSheet).toHaveBeenCalledTimes(1);
  });

  it('renders a message when no module is selected', () => {
    const contextValue = {
      selectedModule: null,
      openCharacterSheet: () => {},
    };

    render(
      <ModuleContext.Provider value={contextValue}>
        <MapArea />
      </ModuleContext.Provider>
    );

    const message = screen.getByText(/select a module to see its character sheet/i);
    expect(message).toBeInTheDocument();
  });
});
