import React from 'react';
import { CheckCircle, Circle, Clock, Tag } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';

export default function TaskCard({ task, onClick }) {
    const { toggleTaskStatus } = useTasks();

    const handleToggle = (e) => {
        e.stopPropagation();
        toggleTaskStatus(task.id);
    };

    const isDone = task.status === 'done';

    return (
        <div
            onClick={onClick}
            className="glass-panel"
            style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                borderLeft: `3px solid ${getPriorityColor(task)}`,
                opacity: isDone ? 0.6 : 1,
                transition: 'transform 0.1s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <button
                onClick={handleToggle}
                style={{ background: 'none', border: 'none', color: isDone ? 'var(--color-success)' : 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
            >
                {isDone ? <CheckCircle size={20} /> : <Circle size={20} />}
            </button>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    fontSize: '0.95rem',
                    marginBottom: '0.25rem',
                    fontWeight: 500,
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-main)'
                }}>
                    {task.title}
                </h4>

                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {task.dueDate && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                    {task.context && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Tag size={12} /> {task.context}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function getPriorityColor(task) {
    if (task.urge && task.imp) return 'var(--color-danger)'; // Q1
    if (!task.urge && task.imp) return 'var(--color-primary)'; // Q2
    if (task.urge && !task.imp) return 'var(--color-warning)'; // Q3
    return 'var(--color-text-muted)'; // Q4
}
