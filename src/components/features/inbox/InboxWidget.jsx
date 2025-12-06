import React, { useState } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { Inbox, Plus, ArrowRight, Zap } from 'lucide-react';

export default function InboxWidget() {
    const { tasks, addTask, updateTask } = useTasks();
    const [quickInput, setQuickInput] = useState('');
    const [showProcess, setShowProcess] = useState(null);

    // Inbox tasks are those without urgency/importance set yet
    const inboxTasks = tasks.filter(t =>
        !t.isArchived &&
        t.status !== 'done' &&
        t.urge === undefined &&
        t.imp === undefined &&
        t.isInbox === true
    );

    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!quickInput.trim()) return;

        addTask({
            title: quickInput,
            isInbox: true,
            urge: undefined,
            imp: undefined,
            context: '@inbox',
            dueDate: ''
        });
        setQuickInput('');
    };

    const processTask = (taskId, urge, imp) => {
        updateTask(taskId, {
            urge,
            imp,
            isInbox: false,
            context: '@home' // Default context after processing
        });
        setShowProcess(null);
    };

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Inbox size={20} style={{ color: '#a855f7' }} />
                </div>
                <div>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>GTD Inbox</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        {inboxTasks.length} item{inboxTasks.length !== 1 ? 's' : ''} to process
                    </p>
                </div>
            </div>

            {/* Quick Capture Input */}
            <form onSubmit={handleQuickAdd} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={quickInput}
                        onChange={(e) => setQuickInput(e.target.value)}
                        placeholder="Quick capture... press Enter"
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            fontSize: '0.9rem'
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ padding: '0.75rem' }}
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </form>

            {/* Inbox Items */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                {inboxTasks.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center'
                    }}>
                        <Zap size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.85rem' }}>Inbox is empty! 🎉</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Capture ideas above</span>
                    </div>
                ) : (
                    inboxTasks.map(task => (
                        <div
                            key={task.id}
                            style={{
                                padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                                borderLeft: '3px solid rgba(168, 85, 247, 0.5)'
                            }}
                        >
                            <span style={{ fontSize: '0.9rem', flex: 1 }}>{task.title}</span>

                            {showProcess === task.id ? (
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button
                                        onClick={() => processTask(task.id, true, true)}
                                        className="btn"
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', border: 'none' }}
                                        title="Q1: Urgent & Important"
                                    >
                                        Q1
                                    </button>
                                    <button
                                        onClick={() => processTask(task.id, false, true)}
                                        className="btn"
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', background: 'rgba(99, 102, 241, 0.2)', border: 'none' }}
                                        title="Q2: Important"
                                    >
                                        Q2
                                    </button>
                                    <button
                                        onClick={() => processTask(task.id, true, false)}
                                        className="btn"
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', border: 'none' }}
                                        title="Q3: Urgent"
                                    >
                                        Q3
                                    </button>
                                    <button
                                        onClick={() => processTask(task.id, false, false)}
                                        className="btn"
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.7rem', background: 'rgba(148, 163, 184, 0.2)', border: 'none' }}
                                        title="Q4: Neither"
                                    >
                                        Q4
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowProcess(task.id)}
                                    className="btn btn-ghost"
                                    style={{ padding: '0.3rem 0.5rem' }}
                                    title="Process this item"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
