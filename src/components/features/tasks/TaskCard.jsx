import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Clock, Tag, Archive, Target, ListChecks } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';

export default function TaskCard({ task, onClick, compact = false }) {
    const { toggleTaskStatus, deleteTask, toggleTimer } = useTasks();
    const { visions = [], values = [] } = useMission();

    // Timer Logic for Card
    const [elapsed, setElapsed] = useState(task.timeSpent || 0);
    const isRunning = !!task.timerStartedAt;

    useEffect(() => {
        let interval;
        if (isRunning) {
            const start = new Date(task.timerStartedAt).getTime();
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
        if (!ms) return "";
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        toggleTaskStatus(task.id);
    };

    const handleTimer = (e) => {
        e.stopPropagation();
        toggleTimer(task.id);
    };

    const [isExiting, setIsExiting] = useState(false);

    const handleArchive = (e) => {
        e.stopPropagation();
        setIsExiting(true);
        setTimeout(() => {
            deleteTask(task.id);
        }, 300); // Wait for animation
    };

    const isDone = task.status === 'done';

    // Find linked compass item
    const linkedItem = task.missionId
        ? [...visions, ...values].find(i => i.id === task.missionId)
        : null;

    if (isExiting) {
        // Return null or empty div to reserve visual space if needed, 
        // but for smooth removal we usually want the element to stay but fade.
    }

    return (
        <div
            onClick={onClick}
            className={`glass-panel ${isExiting ? 'fade-out-exit' : ''}`}
            style={{
                padding: compact ? '0.5rem' : '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: compact ? '0' : '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                gap: compact ? '0.5rem' : '0.75rem',
                alignItems: 'center',
                borderLeft: `3px solid ${getPriorityColor(task)}`,
                opacity: isExiting ? 0 : (isDone ? 0.5 : 1),
                transform: isExiting ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.3s ease-out',
                filter: isDone ? 'grayscale(0.5)' : 'none',
                position: 'relative',
                height: compact ? '100%' : 'auto',
                background: isRunning ? 'linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent)' : 'rgba(255,255,255,0.03)',
                pointerEvents: isExiting ? 'none' : 'auto'
            }}
            onMouseEnter={e => !isExiting && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => !isExiting && (e.currentTarget.style.transform = 'translateY(0)')}
        >
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h4 style={{
                    fontSize: isDone ? '0.8rem' : (compact ? '0.8rem' : '0.9rem'),
                    fontWeight: 500,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    lineHeight: compact ? '1.2' : 'normal',
                    marginBottom: 0
                }}>
                    {task.title}
                </h4>

                {!compact && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {/* Timer Control & Time */}
                        <div 
                            onClick={handleTimer}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                color: isRunning ? '#10b981' : (elapsed > 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)'),
                                fontWeight: isRunning ? 600 : 400,
                                cursor: 'pointer',
                                background: isRunning ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                transition: 'all 0.2s'
                            }}
                            title={isRunning ? "Stop Timer" : "Start Timer"}
                        >
                             <Clock size={12} className={isRunning ? "animate-pulse" : ""} />
                             <span>{elapsed > 0 ? formatDuration(elapsed) : "Start"}</span>
                        </div>

                        {task.dueDate && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Clock size={10} style={{ opacity: 0.7 }} /> {task.dueDate.slice(5)}
                            </span>
                        )}
                        {task.context && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Tag size={10} style={{ opacity: 0.7 }} /> {task.context}
                            </span>
                        )}
                        {linkedItem && (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: '0.2rem',
                                color: 'var(--color-primary)',
                                background: 'rgba(99, 102, 241, 0.1)',
                                padding: '0 4px',
                                borderRadius: '4px'
                            }}>
                                <Target size={10} /> {linkedItem.text.slice(0, 15)}{linkedItem.text.length > 15 ? '...' : ''}
                            </span>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                color: task.subtasks.filter(s => s.completed).length === task.subtasks.length ? '#10b981' : 'var(--color-text-muted)'
                            }}>
                                <ListChecks size={10} />
                                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {isDone && (
                <button
                    onClick={handleArchive}
                    className="btn-archive"
                    title="Archive"
                    style={{ border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                >
                    <Archive size={16} />
                </button>
            )}
        </div>
    );
}

function getPriorityColor(task) {
    if (task.urge && task.imp) return 'var(--color-danger)'; // Q1
    if (!task.urge && task.imp) return 'var(--color-primary)'; // Q2
    if (task.urge && !task.imp) return 'var(--color-warning)'; // Q3
    return 'var(--color-text-muted)'; // Q4
}
