import React, { createContext, useState, useCallback } from 'react';

export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
    const [clientId, setClientId] = useState(null);
    const [players, setPlayers] = useState({});

    // useCallback ensures this function reference is stable
    const handleServerEvent = useCallback((type, payload) => {
        console.log(`Handling server event: ${type}`, payload);
        switch (type) {
            case 'connection_ready':
                setClientId(payload.client_id);
                setPlayers(payload.game_state || {});
                break;
            case 'player_join':
                setPlayers(prevPlayers => ({
                    ...prevPlayers,
                    [payload.id]: payload
                }));
                break;
            case 'player_leave':
                setPlayers(prevPlayers => {
                    const newPlayers = { ...prevPlayers };
                    if (newPlayers[payload.client_id]) {
                        delete newPlayers[payload.client_id];
                    }
                    return newPlayers;
                });
                break;
            default:
                // Do nothing for unhandled event types
                break;
        }
    }, []); // Empty dependency array means this function is created once

    const value = {
        clientId,
        players,
        handleServerEvent
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};
