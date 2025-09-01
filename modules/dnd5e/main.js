(() => {
  console.log("D&D 5E Module Main Script Executing...");

  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        console.log(`Dependency script already loaded: ${url}`);
        return resolve();
      }
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script ${url}`));
      document.head.appendChild(script);
    });
  };

  // The URL to the character sheet component script
  const characterSheetUrl = 'http://localhost:8000/modules/dnd5e/CharacterSheet.js';

  loadScript(characterSheetUrl)
    .then(() => {
      console.log('D&D 5E module components loaded. Firing module-loaded event.');
      const event = new CustomEvent('module-loaded', { detail: { moduleId: 'dnd5e' } });
      window.dispatchEvent(event);
    })
    .catch(error => {
      console.error('Failed to load D&D 5E module components.', error);
    });

})();
