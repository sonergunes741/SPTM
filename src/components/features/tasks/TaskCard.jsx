import React from 'react';
import { CheckCircle, Circle, Clock, Tag, Archive } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';

export default function TaskCard({ task, onClick, compact = false }) {
    const { toggleTaskStatus, deleteTask } = useTasks();

    const handleToggle = (e) => {
        e.stopPropagation();
        toggleTaskStatus(task.id);
    };

    const handleArchive = (e) => {
        e.stopPropagation();
        deleteTask(task.id); // calls archiveTask under the hood now
    };

    const isDone = task.status === 'done';

    return (
        <div
            onClick={onClick}
            className="glass-panel"
            style={{
                padding: compact ? '0.5rem' : '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: compact ? '0' : '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                gap: compact ? '0.5rem' : '0.75rem',
                alignItems: 'center',
                borderLeft: `3px solid ${getPriorityColor(task)}`,
                opacity: isDone ? 0.5 : 1,
                transition: 'all 0.2s',
                filter: isDone ? 'grayscale(0.5)' : 'none',
                position: 'relative',
                height: compact ? '100%' : 'auto'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <button
                onClick={handleToggle}
                style={{ background: 'none', border: 'none', color: isDone ? 'var(--color-success)' : 'var(--color-text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
                {isDone ? <CheckCircle size={compact ? 16 : 18} /> : <Circle size={compact ? 16 : 18} />}
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                    fontSize: isDone ? '0.8rem' : (compact ? '0.8rem' : '0.9rem'),
                    marginBottom: compact ? 0 : '0.2rem',
                    fontWeight: 500,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    lineHeight: compact ? '1.2' : 'normal'
                }}>
                    {task.title}
                </h4>

                {!compact && (
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {task.dueDate && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Clock size={10} /> {task.dueDate.slice(5)}
                            </span>
                        )}
                        {task.context && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Tag size={10} /> {task.context}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {isDone && (
                <button
                    onClick={handleArchive}
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
