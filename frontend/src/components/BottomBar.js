import React, { useContext } from 'react';
import { GameStateContext } from '../context/GameStateContext';

const BottomBar = () => {
  const { eventLog } = useContext(GameStateContext);

  // Get the last message from the log, or a default message
  const lastMessage = eventLog.length > 0 ? eventLog[eventLog.length - 1] : 'No events yet.';

  return (
    <div className="bottom-bar" style={{
      gridArea: 'footer',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '0.9em'
    }}>
      {lastMessage}
    </div>
  );
};

export default BottomBar;
