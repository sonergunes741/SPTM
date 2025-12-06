import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MissionContext = createContext();

export function MissionProvider({ children }) {
    const [missions, setMissions] = useLocalStorage('sptm_missions', []);
    const [vision, setVision] = useLocalStorage('sptm_vision', '');
    const [values, setValues] = useLocalStorage('sptm_values', ''); // Stored as plain text for flexibility

    const addMission = (text, parentId = null) => {
        const newMission = {
            id: crypto.randomUUID(),
            text,
            parentId, // For hierarchy (sub-missions)
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            versions: [] // For history
        };
        setMissions(prev => [...prev, newMission]);
        return newMission;
    };

    const updateMission = (id, newText) => {
        setMissions(prev => prev.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    text: newText,
                    updatedAt: new Date().toISOString(),
                    versions: [...m.versions, { text: m.text, timestamp: new Date().toISOString() }]
                };
            }
            return m;
        }));
    };

    const deleteMission = (id) => {
        // Also likely need to delete children or reassign them, for now simple delete
        setMissions(prev => prev.filter(m => m.id !== id));
    };

    const getRootMissions = () => missions.filter(m => !m.parentId);
    const getSubMissions = (parentId) => missions.filter(m => m.parentId === parentId);

    return (
        <MissionContext.Provider value={{
            missions, addMission, updateMission, deleteMission, getRootMissions, getSubMissions,
            vision, setVision,
            values, setValues
        }}>
            {children}
        </MissionContext.Provider>
    );
}

export function useMission() {
    const context = useContext(MissionContext);
    if (!context) {
        throw new Error('useMission must be used within a MissionProvider');
    }
    return context;
}
