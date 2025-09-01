import React, { useContext } from 'react';
import { ModuleContext } from '../context/ModuleContext';

const ModuleSelector = () => {
  const { modules, selectedModule, selectModule } = useContext(ModuleContext);

  return (
    <div style={{ width: '100%' }}>
      <h4 style={{ marginTop: 0 }}>Game Modules</h4>
      {modules.length === 0 ? (
        <p>No modules loaded.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {modules.map(module => (
            <li key={module.id} style={{ marginBottom: '5px' }}>
              <button
                onClick={() => selectModule(module.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  fontWeight: selectedModule?.id === module.id ? 'bold' : 'normal',
                  backgroundColor: selectedModule?.id === module.id ? '#cce5ff' : '#efefef'
                }}
              >
                {module.name} <span style={{ fontSize: '0.8em', color: '#555' }}>v{module.version}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModuleSelector;
