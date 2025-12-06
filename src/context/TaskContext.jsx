import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGamification } from './GamificationContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useLocalStorage('sptm_tasks', []);
    const { gainXp } = useGamification();

    // Task Model: 
    // id, title, description, missionId, status (todo, in-progress, done), 
    // urgency (bool), importance (bool), dueDate, context (@home, @work)

    const addTask = (taskData) => {
        const newTask = {
            id: crypto.randomUUID(),
            status: 'todo',
            createdAt: new Date().toISOString(),
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

                // Award XP if completing
                if (isNowDone) {
                    // Simple logic: 10 XP per task. Could scale with importance later.
                    gainXp(10, `Completed task: ${t.title}`);
                }

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
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: false } : t));
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            updateTask,
            deleteTask: archiveTask, // Aliased for existing UI
            archiveTask,             // Explicit access
            unarchiveTask,
            deletePermanently,
            toggleTaskStatus
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
