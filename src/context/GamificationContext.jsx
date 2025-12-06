import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
    const [xp, setXp] = useLocalStorage('sptm_xp', 0);
    const [level, setLevel] = useLocalStorage('sptm_level', 1);
    const [history, setHistory] = useLocalStorage('sptm_xp_history', []);

    // Config
    const XP_PER_LEVEL_BASE = 100;

    // Calculate level based on XP
    useEffect(() => {
        // Simple linear leveling for now: Level = 1 + floor(XP / 100)
        // Or progressive: 100, 200, 300... 
        // Let's use a slightly progressive curve or just stick to simple 100 steps for MVP clarity
        const newLevel = Math.floor(xp / XP_PER_LEVEL_BASE) + 1;
        if (newLevel !== level) {
            setLevel(newLevel);
            // Could trigger a "Level Up" toast/modal here
        }
    }, [xp, level, setLevel]);

    const gainXp = (amount, source) => {
        setXp(prev => prev + amount);
        const entry = {
            id: crypto.randomUUID(),
            amount,
            source,
            timestamp: new Date().toISOString()
        };
        setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
    };

    const getXpProgress = () => {
        const currentLevelXpStart = (level - 1) * XP_PER_LEVEL_BASE;
        const nextLevelXpStart = level * XP_PER_LEVEL_BASE;
        const progress = xp - currentLevelXpStart;
        const required = nextLevelXpStart - currentLevelXpStart;
        return { current: progress, required, percentage: (progress / required) * 100 };
    };

    return (
        <GamificationContext.Provider value={{
            xp,
            level,
            history,
            gainXp,
            getXpProgress
        }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
}
