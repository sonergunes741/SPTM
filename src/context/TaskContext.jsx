import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TaskContext = createContext();

const DEFAULT_CONTEXTS = [
    { id: 'c1', name: '@home', icon: '🏠' },
    { id: 'c2', name: '@work', icon: '💼' },
    { id: 'c3', name: '@computer', icon: '💻' },
    { id: 'c4', name: '@phone', icon: '📱' },
    { id: 'c5', name: '@errands', icon: '🚗' },
    { id: 'c6', name: '@waiting', icon: '⏳' },
    { id: 'c7', name: '@anywhere', icon: '🌍' }
];

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useLocalStorage('sptm_tasks', []);
    const [contexts, setContexts] = useLocalStorage('sptm_contexts_v1', DEFAULT_CONTEXTS);

    const addTask = (taskData) => {
        const newTask = {
            id: crypto.randomUUID(),
            status: 'todo',
            createdAt: new Date().toISOString(),
            timeSpent: 0,
            timerStartedAt: null,
            ...taskData
        };
        setTasks(prev => [...prev, newTask]);
        return newTask;
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const toggleTaskStatus = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const isNowDone = t.status !== 'done';
                return {
                    ...t,
                    status: isNowDone ? 'done' : 'todo',
                    completedAt: isNowDone ? new Date().toISOString() : null
                };
            }
            return t;
        }));
    };

    const archiveTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: true } : t));
    };

    const deletePermanently = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const unarchiveTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: false, status: 'todo', completedAt: null } : t));
    };

    const addContext = (name, icon = '🏷️') => {
        const newContext = { id: crypto.randomUUID(), name, icon };
        setContexts(prev => [...prev, newContext]);
    };

    const deleteContext = (id) => {
        setContexts(prev => prev.filter(c => c.id !== id));
    };

    const restoreContexts = () => {
        setContexts(DEFAULT_CONTEXTS);
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            contexts,
            addTask,
            updateTask,
            deleteTask: archiveTask, // Aliased for backward compatibility if needed
            archiveTask,
            unarchiveTask,
            deletePermanently,
            toggleTaskStatus,
            addContext,
            deleteContext,
            restoreContexts,
            toggleTimer: (id) => {
                const now = Date.now();
                setTasks(prev => prev.map(t => {
                    const isTarget = t.id === id;
                    if (!isTarget && t.timerStartedAt) {
                        const delta = now - new Date(t.timerStartedAt).getTime();
                        return { ...t, timerStartedAt: null, timeSpent: (t.timeSpent || 0) + delta };
                    }
                    if (isTarget) {
                        if (t.timerStartedAt) {
                            const delta = now - new Date(t.timerStartedAt).getTime();
                            return { ...t, timerStartedAt: null, timeSpent: (t.timeSpent || 0) + delta };
                        } else {
                            return { ...t, timerStartedAt: new Date().toISOString() };
                        }
                    }
                    return t;
                }));
            }
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
