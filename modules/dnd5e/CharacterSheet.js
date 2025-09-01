(() => {
  // This script assumes 'React' is available on the window object,
  // which is true in a standard create-react-app environment.
  if (typeof React === 'undefined') {
    console.error('React is not available. This script needs to be loaded after React.');
    return;
  }

  // Create a namespace on the window object for this module's components
  if (!window.dnd5e_components) {
    window.dnd5e_components = {};
  }

  const e = React.createElement;

  // Define the CharacterSheet component using React.createElement
  const CharacterSheet = () => {
    return e(
      'div',
      { style: { padding: '20px', border: '1px solid blue', backgroundColor: 'white' } },
      e('h2', null, 'D&D 5e Character Sheet'),
      e('p', null, 'This is a dynamically loaded character sheet component.'),
      e('p', null, 'Name: John Doe'),
      e('p', null, 'Class: Fighter')
    );
  };

  // Attach the component to the module's namespace on the window
  window.dnd5e_components.CharacterSheet = CharacterSheet;

  console.log('dnd5e CharacterSheet component defined and attached to window.');
})();
