import React, { useState } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { Plus, X, LayoutGrid, List, Mic } from 'lucide-react';
import useVoiceInput from '../../../hooks/useVoiceInput';
import { useEffect } from 'react';

export default function CoveyMatrix() {
    const { tasks, addTask } = useTasks();
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [selectedTask, setSelectedTask] = useState(null);

    // Filtering Logic
    // Show tasks if:
    // 1. Not archived
    // 2. AND (Status is 'todo' OR (Status is 'done' AND completed less than 24h ago))

    const isVisible = (t) => {
        if (t.isArchived) return false;
        if (t.isInbox) return false; // Don't show inbox items in matrix
        if (t.status !== 'done') return true;
        // If done, check if within 24h
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
        <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
                    }}>
                        <LayoutGrid size={24} style={{ color: '#c4b5fd' }} />
                    </div>
                    <div>
                        <h3 className="text-gradient-primary" style={{ fontSize: '1.5rem', margin: 0, lineHeight: 1 }}>Priorities Matrix</h3>
                         <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                            Eisenhower Method
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                     <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: 'var(--radius-md)', display: 'flex', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{ 
                                background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', 
                                border: 'none', 
                                color: viewMode === 'list' ? 'white' : 'var(--color-text-muted)', 
                                padding: '0.4rem', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                display: 'flex',
                                transition: 'all 0.2s'
                            }}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{ 
                                background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', 
                                border: 'none', 
                                color: viewMode === 'grid' ? 'white' : 'var(--color-text-muted)', 
                                padding: '0.4rem', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                display: 'flex',
                                transition: 'all 0.2s'
                            }}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
                        <Plus size={20} /> New Task
                    </button>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                flex: 1, // Take remaining space
                minHeight: 0, // Allow nested scroll
                overflow: 'hidden' // Contain children
            }}>
                <Quadrant id="q1" title="Q1: Urgent & Important" tasks={q1} color="var(--color-danger)" viewMode={viewMode} onTaskClick={setSelectedTask} />
                <Quadrant id="q2" title="Q2: Not Urgent & Important" tasks={q2} color="var(--color-primary)" viewMode={viewMode} onTaskClick={setSelectedTask} />
                <Quadrant id="q3" title="Q3: Urgent & Not Important" tasks={q3} color="var(--color-warning)" viewMode={viewMode} onTaskClick={setSelectedTask} />
                <Quadrant id="q4" title="Q4: Not Urgent & Not Important" tasks={q4} color="var(--color-text-muted)" viewMode={viewMode} onTaskClick={setSelectedTask} />
            </div>

            {showForm && (
                <TaskModal onClose={() => setShowForm(false)} onSave={addTask} />
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}

// Import useDroppable
import { useDroppable } from '@dnd-kit/core';

// Import CSS for Draggable
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

// Draggable Wrapper for Matrix Items
function DraggableMatrixItem({ task, viewMode, onClick }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1, // Completely hide original
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 999 : 'auto', // Ensure it floats above
        height: viewMode === 'list' ? 'auto' : '100%' // Maintain height in grid
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} compact={viewMode === 'grid'} onClick={onClick} />
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
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `4px solid ${color}`,
                transition: 'all 0.3s ease',
                background: isOver 
                    ? `rgba(255, 255, 255, 0.1)` 
                    : 'rgba(30, 41, 59, 0.4)', // Highlight on hover
                border: isOver ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.05)',
                height: '100%',
                overflow: 'hidden'
            }}
        >
            <h4 style={{ marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title} <span style={{ opacity: 0.5, marginLeft: '0.5rem' }}>{tasks.length}</span>
            </h4>
            <div style={{
                overflowY: 'auto',
                paddingRight: '0.25rem',
                flex: 1,
                display: viewMode === 'grid' ? 'grid' : 'flex',
                flexDirection: viewMode === 'list' ? 'column' : undefined,
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(140px, 1fr))' : undefined,
                gap: '0.5rem',
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
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'rgba(255,255,255,0.1)', 
                        fontSize: '0.85rem', 
                        fontStyle: 'italic'
                    }}>
                        {isOver ? "Drop here!" : "Empty"}
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskModal({ onClose, onSave }) {
    const { visions = [], values = [], missions = [] } = useMission(); // Get Compass items
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
    const [form, setForm] = useState({
        title: '',
        urge: false,
        imp: false,
        dueDate: '',
        context: '@home',
        missionId: '' // New Linking Field
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
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center'
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
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}>Link to Mission (Why?)</label>
                        <select
                            style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            value={form.missionId}
                            onChange={e => setForm({ ...form, missionId: e.target.value })}
                        >
                            <option value="">-- No specific Link --</option>
                            {(visions.length > 0 || values.length > 0 || missions.length > 0) ? (
                                <>
                                    <optgroup label="Roles & Key Areas">
                                        {/* Flatten missions for dropdown - focusing on leaf nodes (Roles) mainly, but let's show all for flexibility */}
                                        {missions.map(m => (
                                            <React.Fragment key={m.id}>
                                                <option value={m.id}>🎯 {m.text}</option>
                                                {/* If we had a flat list of sub-missions we could map them here, but getSubMissions is a function. 
                                                    Ideally we'd flatten this outside render or use a helper. 
                                                    For now, let's just stick to top-level missions + one level deep if needed, 
                                                    but getRootMissions vs missions... 'missions' contains ALL missions (root + subs) in the context?
                                                    Check MissionContext. missions is the state array containing ALL items.
                                                */}
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Context (GTD)</label>
                            <select
                                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                value={form.context}
                                onChange={e => setForm({ ...form, context: e.target.value })}
                            >
                                <option value="@home">🏠 @home</option>
                                <option value="@work">💼 @work</option>
                                <option value="@computer">💻 @computer</option>
                                <option value="@phone">📱 @phone</option>
                                <option value="@errands">🚗 @errands</option>
                                <option value="@waiting">⏳ @waiting</option>
                                <option value="@anywhere">🌍 @anywhere</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Task</button>
                </form>
            </div>
        </div>
    )
}
