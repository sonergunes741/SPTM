import React, { useState, useEffect } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';
import {
    X, CheckCircle2, Circle, Plus, Trash2, Clock, Tag, Target,
    ListChecks, Edit2, Save, Calendar, Archive
} from 'lucide-react';

export default function TaskDetailModal({ task, onClose }) {
    const { updateTask, deleteTask, deletePermanently, toggleTimer } = useTasks();
    const { visions = [], values = [], missions = [] } = useMission();

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        context: task.context || '@home',
        urge: task.urge || false,
        imp: task.imp || false,
        missionId: task.missionId || '',
        subtasks: task.subtasks || []
    });
    const [newSubtask, setNewSubtask] = useState('');

    // Timer Logic
    const [elapsed, setElapsed] = useState(task.timeSpent || 0);
    const isRunning = !!task.timerStartedAt;

    useEffect(() => {
        let interval;
        if (isRunning) {
            const start = new Date(task.timerStartedAt).getTime();
            // Upkeep live display
            setElapsed((task.timeSpent || 0) + (Date.now() - start));
            
            interval = setInterval(() => {
                setElapsed((task.timeSpent || 0) + (Date.now() - start));
            }, 1000);
        } else {
            setElapsed(task.timeSpent || 0);
        }
        return () => clearInterval(interval);
    }, [task.timeSpent, task.timerStartedAt, isRunning]);

    const formatDuration = (ms) => {
        if (!ms) return "0m";
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        setForm({
            title: task.title || '',
            description: task.description || '',
            dueDate: task.dueDate || '',
            context: task.context || '@home',
            urge: task.urge || false,
            imp: task.imp || false,
            missionId: task.missionId || '',
            subtasks: task.subtasks || []
        });
    }, [task]);

    const handleSave = () => {
        updateTask(task.id, form);
        setEditMode(false);
    };

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;

        const newSubtaskItem = {
            id: crypto.randomUUID(),
            text: newSubtask,
            completed: false
        };

        const updatedSubtasks = [...form.subtasks, newSubtaskItem];
        setForm({ ...form, subtasks: updatedSubtasks });
        updateTask(task.id, { subtasks: updatedSubtasks });
        setNewSubtask('');
    };

    const toggleSubtask = (subtaskId) => {
        const updatedSubtasks = form.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        setForm({ ...form, subtasks: updatedSubtasks });
        updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const deleteSubtask = (subtaskId) => {
        const updatedSubtasks = form.subtasks.filter(st => st.id !== subtaskId);
        setForm({ ...form, subtasks: updatedSubtasks });
        updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const subtasksCompleted = form.subtasks.filter(st => st.completed).length;
    const subtasksTotal = form.subtasks.length;
    const subtaskProgress = subtasksTotal > 0 ? Math.round((subtasksCompleted / subtasksTotal) * 100) : 0;

    const linkedItem = form.missionId
        ? [...visions, ...values, ...missions].find(i => i.id === form.missionId)
        : null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="glass-panel" style={{
                width: '550px',
                maxHeight: '85vh',
                padding: '0',
                borderRadius: 'var(--radius-lg)',
                background: '#1e293b',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}>
                    <div style={{ flex: 1 }}>
                        {editMode ? (
                            <input
                                autoFocus
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                style={{
                                    width: '100%',
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.5rem',
                                    color: 'white'
                                }}
                            />
                        ) : (
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{form.title}</h3>
                        )}

                        {/* Priority Tags */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                            {form.urge && (
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    color: '#ef4444'
                                }}>
                                    ⚡ Urgent
                                </span>
                            )}
                            {form.imp && (
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    color: '#6366f1'
                                }}>
                                    ⭐ Important
                                </span>
                            )}
                            {linkedItem && (
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(168, 85, 247, 0.2)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    color: '#a855f7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <Target size={12} /> {linkedItem.text?.slice(0, 20)}...
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* Timer Control */}
                         <button 
                            onClick={() => toggleTimer(task.id)} 
                            className="btn btn-ghost" 
                            style={{ 
                                padding: '0.5rem 0.75rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: isRunning ? '#10b981' : 'inherit',
                                background: isRunning ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                border: isRunning ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
                            }}
                            title={isRunning ? "Stop Timer" : "Start Timer"}
                        >
                            <Clock size={18} className={isRunning ? "animate-pulse" : ""} />
                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {formatDuration(elapsed)}
                            </span>
                        </button>

                        {editMode ? (
                            <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.5rem' }}>
                                <Save size={18} />
                            </button>
                        ) : (
                            <button onClick={() => setEditMode(true)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                                <Edit2 size={18} />
                            </button>
                        )}
                        <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1.5rem'
                }}>
                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                <Calendar size={14} /> Due Date
                            </label>
                            {editMode ? (
                                <input
                                    type="date"
                                    value={form.dueDate}
                                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white'
                                    }}
                                />
                            ) : (
                                <span style={{ fontSize: '0.9rem' }}>{form.dueDate || 'Not set'}</span>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                <Tag size={14} /> Context
                            </label>
                            {editMode ? (
                                <select
                                    value={form.context}
                                    onChange={e => setForm({ ...form, context: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white'
                                    }}
                                >
                                    <option value="@home">@home</option>
                                    <option value="@work">@work</option>
                                    <option value="@errands">@errands</option>
                                    <option value="@computer">@computer</option>
                                    <option value="@phone">@phone</option>
                                    <option value="@waiting">@waiting</option>
                                </select>
                            ) : (
                                <span style={{ fontSize: '0.9rem' }}>{form.context}</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                            Description
                        </label>
                        {editMode ? (
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Add notes or details..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'white',
                                    resize: 'vertical'
                                }}
                            />
                        ) : (
                            <p style={{
                                fontSize: '0.9rem',
                                color: form.description ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                fontStyle: form.description ? 'normal' : 'italic'
                            }}>
                                {form.description || 'No description'}
                            </p>
                        )}
                    </div>

                    {/* Subtasks / Checklist */}
                    <div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                <ListChecks size={16} style={{ color: 'var(--color-primary)' }} />
                                Checklist
                            </label>
                            {subtasksTotal > 0 && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    {subtasksCompleted}/{subtasksTotal}
                                    <div style={{
                                        width: '60px',
                                        height: '4px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '2px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${subtaskProgress}%`,
                                            background: subtaskProgress === 100 ? '#10b981' : 'var(--color-primary)',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </span>
                            )}
                        </div>

                        {/* Subtask List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            {form.subtasks.map(subtask => (
                                <div
                                    key={subtask.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.6rem 0.75rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: 'var(--radius-sm)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <button
                                        onClick={() => toggleSubtask(subtask.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: subtask.completed ? '#10b981' : 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex'
                                        }}
                                    >
                                        {subtask.completed
                                            ? <CheckCircle2 size={18} />
                                            : <Circle size={18} />
                                        }
                                    </button>
                                    <span style={{
                                        flex: 1,
                                        fontSize: '0.9rem',
                                        textDecoration: subtask.completed ? 'line-through' : 'none',
                                        opacity: subtask.completed ? 0.6 : 1
                                    }}>
                                        {subtask.text}
                                    </span>
                                    <button
                                        onClick={() => deleteSubtask(subtask.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-text-muted)',
                                            cursor: 'pointer',
                                            padding: '0.25rem',
                                            opacity: 0.5,
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseEnter={e => e.target.style.opacity = 1}
                                        onMouseLeave={e => e.target.style.opacity = 0.5}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Subtask */}
                        <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={e => setNewSubtask(e.target.value)}
                                placeholder="Add a checklist item..."
                                style={{
                                    flex: 1,
                                    padding: '0.6rem 0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                type="submit"
                                className="btn btn-ghost"
                                style={{ padding: '0.6rem' }}
                            >
                                <Plus size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => { deleteTask(task.id); onClose(); }} // deleteTask is Archive in context
                            className="btn"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: 'none',
                                color: 'var(--color-text-muted)',
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Archive size={16} /> Archive
                        </button>
                        <button
                            onClick={() => { 
                                if(window.confirm('Are you sure you want to delete this task permanently?')) {
                                    deletePermanently(task.id); 
                                    onClose(); 
                                }
                            }}
                            className="btn"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: 'none',
                                color: '#ef4444',
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
