import React, { useContext } from 'react';
import { GameStateContext } from '../context/GameStateContext';

const RightPanel = () => {
  const { clientId, players } = useContext(GameStateContext);

  return (
    <div className="right-panel" style={{
      gridArea: 'sidebar-right',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <h3 style={{ marginTop: 0 }}>Players Online ({Object.keys(players).length})</h3>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0, width: '100%' }}>
        {Object.values(players).map(player => (
          <li key={player.id} style={{
            wordBreak: 'break-all',
            marginBottom: '8px',
            backgroundColor: player.id === clientId ? '#d0e0ff' : 'transparent',
            padding: '4px',
            borderRadius: '4px'
          }}>
            <span style={{ fontSize: '0.8em' }}>{player.id}</span>
            {player.id === clientId && <strong> (You)</strong>}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', fontSize: '0.7em' }}>
          <p>Your Client ID:</p>
          <p style={{ wordBreak: 'break-all' }}>{clientId || 'Connecting...'}</p>
      </div>
    </div>
  );
};

export default RightPanel;
