import React, { useState, useEffect } from 'react';
import { useTasks } from '../../../context/TaskContext';
import useVoiceInput from '../../../hooks/useVoiceInput';
import { Plus, Zap, Mic, Trash2, X } from 'lucide-react';

export default function QuickInboxModal({ onClose }) {
    const { tasks, addTask, deletePermanently } = useTasks();
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
    const [quickInput, setQuickInput] = useState('');

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
        resetTranscript();
    };

    // Auto-fill transcript
    useEffect(() => {
        if (transcript && isListening) {
            setQuickInput(transcript);
        }
    }, [transcript, isListening]);

    return (
        <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.75rem',
            width: '320px',
            maxHeight: '400px',
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            {/* Header */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <Zap size={16} />
                    <span>Quick Inbox</span>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                    className="hover-text-white"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Input */}
            <div style={{ padding: '1rem' }}>
                <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            autoFocus
                            type="text"
                            value={isListening ? transcript : quickInput}
                            onChange={(e) => setQuickInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Capture..."}
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                paddingRight: '2rem',
                                borderRadius: '6px',
                                border: `1px solid ${isListening ? 'var(--color-danger)' : 'rgba(255,255,255,0.1)'}`,
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="button"
                            onClick={isListening ? stopListening : startListening}
                            style={{
                                position: 'absolute',
                                right: '0.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: isListening ? 'var(--color-danger)' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                display: 'flex'
                            }}
                        >
                            <Mic size={14} className={isListening ? 'pulse' : ''} />
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.75rem' }} disabled={!quickInput.trim() && !isListening}>
                        <Plus size={16} />
                    </button>
                </form>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {inboxTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.6 }}>
                        Inbox empty
                    </div>
                ) : (
                    inboxTasks.map(task => (
                        <div key={task.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '6px',
                            borderLeft: '2px solid rgba(168, 85, 247, 0.4)',
                            transition: 'background 0.2s'
                        }}>
                            <span style={{ fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>{task.title}</span>
                            <button
                                onClick={() => deletePermanently(task.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.4, cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
