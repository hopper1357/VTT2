import React from 'react';
import ModuleSelector from './ModuleSelector';

const LeftPanel = () => {
  return (
    <div className="left-panel" style={{
      gridArea: 'sidebar-left',
      backgroundColor: '#f8f9fa',
      border: '1px solid #ccc',
      padding: '10px'
    }}>
      <ModuleSelector />
    </div>
  );
};

export default LeftPanel;
