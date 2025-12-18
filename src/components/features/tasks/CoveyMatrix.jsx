import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import QuickInboxModal from '../inbox/QuickInboxModal';
import ContextManagerModal from './ContextManagerModal';
import { Plus, X, LayoutGrid, List, Zap, Filter, Mic, Settings } from 'lucide-react';
import useVoiceInput from '../../../hooks/useVoiceInput';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function CoveyMatrix() {
    const { tasks, addTask, contexts } = useTasks();
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeContextId, setActiveContextId] = useState('all');
    const [showQuickInbox, setShowQuickInbox] = useState(false);
    const [showContextManager, setShowContextManager] = useState(false);
    const containerRef = useRef(null);

    // Filter Logic
    const isVisible = (t) => {
        if (t.isArchived) return false;
        if (t.isInbox) return false;

        // Context Filter
        if (activeContextId !== 'all') {
            const ctx = contexts.find(c => c.id === activeContextId);
            if (ctx && t.context !== ctx.name) return false;
        }

        if (t.status !== 'done') return true;
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const completeTime = new Date(t.completedAt).getTime();
        return (Date.now() - completeTime) < ONE_DAY;
    };

    const visibleTasks = tasks.filter(isVisible);

    const q1 = visibleTasks.filter(t => t.urge && t.imp);
    const q2 = visibleTasks.filter(t => !t.urge && t.imp);
    const q3 = visibleTasks.filter(t => t.urge && !t.imp);
    const q4 = visibleTasks.filter(t => !t.urge && !t.imp);

    return (
        <div ref={containerRef} className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '1.0rem 1.5rem 1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            overflow: 'visible'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Left: Title & Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div>
                        <h3
                            className="text-gradient-primary"
                            style={{ fontSize: '1.5rem', margin: 0, lineHeight: 1, cursor: 'pointer' }}
                            onClick={() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        >
                            Priorities Matrix
                        </h3>

                    </div>


                    {/* View Toggle - Controls Tasks View inside Quadrants */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: 'var(--radius-md)', display: 'flex', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'list' ? 'white' : 'var(--color-text-muted)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }} title="List View"><List size={18} /></button>
                        <button onClick={() => setViewMode('grid')} style={{ background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'grid' ? 'white' : 'var(--color-text-muted)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }} title="Card View"><LayoutGrid size={18} /></button>
                    </div>

                    {/* Context Filter & Manager */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            padding: '0.4rem 0.75rem',
                            gap: '0.5rem',
                            minWidth: '200px'
                        }}>
                            <Filter size={14} className="text-muted" />
                            <select
                                value={activeContextId}
                                onChange={(e) => setActiveContextId(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    flex: 1,
                                    width: '100%'
                                }}
                            >
                                <option value="all" style={{ background: '#1e293b' }}>Context</option>
                                {contexts.map(c => (
                                    <option key={c.id} value={c.id} style={{ background: '#1e293b' }}>{c.icon} {c.name}</option>
                                ))}
                            </select>

                            {/* Manage Button */}
                            <button
                                onClick={() => setShowContextManager(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                    padding: '0 0 0 0.5rem',
                                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                                    marginLeft: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%'
                                }}
                                title="Manage Contexts"
                            >
                                <Settings size={14} />
                            </button>
                        </div>
                    </div>


                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', marginRight: '0.5rem' }}>


                    {/* Quick Inbox */}
                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowQuickInbox(!showQuickInbox)}
                            style={{
                                padding: '0.6rem 1.25rem',
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                                border: '1px solid transparent',
                                lineHeight: '1.5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                minWidth: '150px',
                                justifyContent: 'center',
                                background: '#0f172a',
                                color: 'white'
                            }}
                        >
                            <Zap size={20} color="#f59e0b" fill="#f59e0b" /> Quick Inbox
                        </button>
                        {showQuickInbox && <QuickInboxModal onClose={() => setShowQuickInbox(false)} />}
                    </div>

                    {/* New Task */}
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '0.6rem 1.25rem 0.6rem 1.25rem',
                            fontSize: '0.95rem',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                            border: '1px solid transparent',
                            lineHeight: '1.5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            minWidth: '150px',
                            justifyContent: 'flex-start',
                            background: '#0f172a',
                            color: 'white'
                        }}
                    >
                        <Plus size={22} color="#6366f1" strokeWidth={5} /> New Task
                    </button>
                </div>
            </div>

            {/* Matrix Grid - Always 2x2 for Matrix Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                paddingRight: '0.5rem'
            }}>
                <Quadrant id="q1" title="Urgent & Important" tasks={q1} color="var(--color-danger)" viewMode={viewMode} onTaskClick={setSelectedTask} />
                <Quadrant id="q2" title="Important & Not Urgent" tasks={q2} color="var(--color-primary)" viewMode={viewMode} onTaskClick={setSelectedTask} />
                <Quadrant id="q3" title="Urgent & Not Important" tasks={q3} color="var(--color-warning)" viewMode={viewMode} onTaskClick={setSelectedTask} />
                <Quadrant id="q4" title="Not Urgent & Not Important" tasks={q4} color="var(--color-text-muted)" viewMode={viewMode} onTaskClick={setSelectedTask} />
            </div>

            {showForm && (
                <TaskModal onClose={() => setShowForm(false)} onSave={addTask} contexts={contexts} />
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

            {showContextManager && (
                <ContextManagerModal onClose={() => setShowContextManager(false)} />
            )}
        </div>
    );
}

function DraggableMatrixItem({ task, viewMode, onClick }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 999 : 'auto',
        height: 'auto'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} compact={false} onClick={onClick} />
        </div>
    );
}

function Quadrant({ id, title, tasks, color, viewMode, onTaskClick }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                background: isOver ? `rgba(255, 255, 255, 0.08)` : 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: isOver ? `0 0 20px ${color}20` : 'none',
                height: '280px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Color Strip Header */}
            <div style={{
                borderTop: `6px solid ${color}`,
                background: `linear-gradient(to bottom, ${color}15, transparent)`,
                padding: '0.75rem 1rem 0.5rem 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </h4>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, background: 'rgba(0,0,0,0.2)', padding: '0.1rem 0.5rem', borderRadius: '12px', color: '#fff' }}>
                    {tasks.length}
                </span>
            </div>

            {/* Task Area - Dynamic Grid/List Layout */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem 1rem 1rem 1rem',
                // DYNAMIC LAYOUT HERE
                display: viewMode === 'grid' ? 'grid' : 'flex',
                flexDirection: viewMode === 'list' ? 'column' : undefined,
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : undefined,
                gap: '0.5rem', // Reduced Gap
                alignItems: viewMode === 'list' ? 'stretch' : 'start',
                alignContent: 'start'
            }}>
                {tasks.map(t => (
                    <DraggableMatrixItem
                        key={t.id}
                        task={t}
                        viewMode={viewMode}
                        onClick={() => onTaskClick(t)}
                    />
                ))}

                {tasks.length === 0 && (
                    <div style={{
                        gridColumn: viewMode === 'grid' ? '1 / -1' : undefined,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.1,
                        fontStyle: 'italic',
                        minHeight: '100px'
                    }}>
                        Empty
                    </div>
                )}
            </div>
        </div>
    );
}


function TaskModal({ onClose, onSave, contexts }) {
    const { visions = [], values = [], missions = [] } = useMission();
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
    const [form, setForm] = useState({
        title: '',
        urge: false,
        imp: false,
        dueDate: '',
        context: '@home',
        missionId: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) return;
        onSave(form);
        resetTranscript();
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="glass-panel" style={{ width: '450px', padding: '2rem', borderRadius: 'var(--radius-lg)', background: '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3>Add New Task</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Task Title</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    paddingRight: '2.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: `1px solid ${isListening ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'white',
                                    transition: 'all 0.2s'
                                }}
                                value={isListening ? transcript : form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder={isListening ? "Listening..." : "What needs to be done?"}
                            />
                            <button
                                type="button"
                                onClick={isListening ? stopListening : startListening}
                                style={{
                                    position: 'absolute',
                                    right: '0.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: isListening ? 'var(--color-danger)' : 'var(--color-text-muted)',
                                    cursor: 'pointer'
                                }}
                                title="Voice Input"
                            >
                                <Mic size={18} className={isListening ? 'pulse' : ''} />
                            </button>
                        </div>
                        {useEffect(() => {
                            if (transcript && isListening) {
                                setForm(prev => ({ ...prev, title: transcript }));
                            }
                        }, [transcript, isListening])}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label style={{ flex: 1, padding: '1rem', border: `1px solid ${form.urge ? 'var(--color-danger)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', background: form.urge ? 'rgba(239, 68, 68, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                            <input type="checkbox" checked={form.urge} onChange={e => setForm({ ...form, urge: e.target.checked })} style={{ display: 'none' }} />
                            Urgent ⚡
                        </label>
                        <label style={{ flex: 1, padding: '1rem', border: `1px solid ${form.imp ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', background: form.imp ? 'rgba(99, 102, 241, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
                            <input type="checkbox" checked={form.imp} onChange={e => setForm({ ...form, imp: e.target.checked })} style={{ display: 'none' }} />
                            Important ⭐
                        </label>
                    </div>

                    {/* Linking Section */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Link to Mission</label>
                        <select
                            style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            value={form.missionId}
                            onChange={e => setForm({ ...form, missionId: e.target.value })}
                        >
                            <option value="">-- No specific Link --</option>
                            {(visions.length > 0 || values.length > 0 || missions.length > 0) ? (
                                <>
                                    <optgroup label="Roles & Key Areas">
                                        {missions.map(m => (
                                            <React.Fragment key={m.id}>
                                                <option value={m.id}>🎯 {m.text}</option>
                                            </React.Fragment>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Long-Term Vision">
                                        {visions.map(v => <option key={v.id} value={v.id}>👁 {v.text}</option>)}
                                    </optgroup>
                                    <optgroup label="Core Values">
                                        {values.map(v => <option key={v.id} value={v.id}>❤️ {v.text}</option>)}
                                    </optgroup>
                                </>
                            ) : <option disabled>No Compass defined yet</option>}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Due Date</label>
                            <input
                                type="date"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                value={form.dueDate}
                                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Context</label>
                            <select
                                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                value={form.context}
                                onChange={e => setForm({ ...form, context: e.target.value })}
                            >
                                {contexts.map(c => (
                                    <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Task</button>
                </form>
            </div>
        </div>
    )
}
