/**
 * Dynamically loads a script by injecting a <script> tag into the document.
 * @param {string} url The URL of the script to load.
 * @returns {Promise<void>} A promise that resolves when the script is loaded,
 *                          and rejects if the script fails to load.
 */
export const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    // Check if the script has already been added to the DOM
    if (document.querySelector(`script[src="${url}"]`)) {
      console.log(`Script already loaded or loading: ${url}`);
      // You might want to handle this case differently, e.g., by checking a global flag
      // to see if the script's code has already executed. For now, we resolve.
      return resolve();
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
      console.log(`Successfully loaded script: ${url}`);
      // It's good practice to remove the script tag once loaded if it's a one-time execution
      // but for modules that might define global functions, we'll leave it.
      resolve();
    };

    script.onerror = () => {
      console.error(`Failed to load script: ${url}`);
      // Also remove the failed script tag from the DOM
      script.remove();
      reject(new Error(`Failed to load script: ${url}`));
    };

    document.head.appendChild(script);
  });
};
