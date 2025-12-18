import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MissionContext = createContext();

const DEMO_MISSIONS = [
    { id: 'm1', text: "To lead a life centered on integrity and empathy, inspiring others to grow.", parentId: null, createdAt: new Date().toISOString(), versions: [] },
    { id: 'm2', text: "To innovate relentlessly and solve complex problems with elegant simplicity.", parentId: null, createdAt: new Date().toISOString(), versions: [] },
    { id: 'm3', text: "To cultivate deep connections and maintain a harmonious work-life balance.", parentId: null, createdAt: new Date().toISOString(), versions: [] }
];

const DEMO_VALUES = [
    { id: 'v1', text: "Integrity & Honesty" },
    { id: 'v2', text: "Continuous Growth" },
    { id: 'v3', text: "Empathy & Respect" }
];

export function MissionProvider({ children }) {
    const [missions, setMissions] = useLocalStorage('sptm_missions_v2', DEMO_MISSIONS);
    const [visions, setVisions] = useLocalStorage('sptm_visions_v2', []);
    const [values, setValues] = useLocalStorage('sptm_core_values_v2', DEMO_VALUES);

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
