import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useLocalStorage('sptm_tasks', []);

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
                return { ...t, status: t.status === 'done' ? 'todo' : 'done' };
            }
            return t;
        }));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskStatus }}>
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
