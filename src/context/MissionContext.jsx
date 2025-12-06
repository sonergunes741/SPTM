import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MissionContext = createContext();

export function MissionProvider({ children }) {
    const [missions, setMissions] = useLocalStorage('sptm_missions', []);
    const [visions, setVisions] = useLocalStorage('sptm_visions', []); // Array of {id, text, linkedMissionIds}
    const [values, setValues] = useLocalStorage('sptm_core_values', []); // Array of {id, text}

    // --- Missions ---
    const addMission = (text, parentId = null) => {
        const newMission = {
            id: crypto.randomUUID(),
            text,
            parentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            versions: []
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
        setMissions(prev => prev.filter(m => m.id !== id));
    };

    const getRootMissions = () => missions.filter(m => !m.parentId);
    const getSubMissions = (parentId) => missions.filter(m => m.parentId === parentId);

    // --- Visions ---
    const addVision = (text) => {
        const newVision = { id: crypto.randomUUID(), text };
        setVisions(prev => [...prev, newVision]);
    };
    const updateVision = (id, text) => {
        setVisions(prev => prev.map(v => v.id === id ? { ...v, text } : v));
    };
    const deleteVision = (id) => {
        setVisions(prev => prev.filter(v => v.id !== id));
    };

    // --- Values ---
    const addValue = (text) => {
        const newValue = { id: crypto.randomUUID(), text };
        setValues(prev => [...prev, newValue]);
    };
    const updateValue = (id, text) => {
        setValues(prev => prev.map(v => v.id === id ? { ...v, text } : v));
    };
    const deleteValue = (id) => {
        setValues(prev => prev.filter(v => v.id !== id));
    };

    return (
        <MissionContext.Provider value={{
            missions, addMission, updateMission, deleteMission, getRootMissions, getSubMissions,
            visions, addVision, updateVision, deleteVision,
            values, addValue, updateValue, deleteValue
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
