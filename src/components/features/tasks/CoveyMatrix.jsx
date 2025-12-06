import React, { useState } from 'react';
import { useTasks } from '../../../context/TaskContext';
import TaskCard from './TaskCard';
import { Plus, X, LayoutGrid, List } from 'lucide-react';

export default function CoveyMatrix() {
    const { tasks, addTask } = useTasks();
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    // Filtering Logic
    // Show tasks if:
    // 1. Not archived
    // 2. AND (Status is 'todo' OR (Status is 'done' AND completed less than 24h ago))

    const isVisible = (t) => {
        if (t.isArchived) return false;
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h3>Priorities Matrix</h3>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: 'var(--radius-md)', display: 'flex' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{ background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{ background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New Task
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                alignContent: 'start' // Don't stretch rows unnecessarily, let content dictate
            }}>
                <Quadrant title="Q1: Urgent & Important" tasks={q1} color="var(--color-danger)" viewMode={viewMode} />
                <Quadrant title="Q2: Not Urgent & Important" tasks={q2} color="var(--color-primary)" viewMode={viewMode} />
                <Quadrant title="Q3: Urgent & Not Important" tasks={q3} color="var(--color-warning)" viewMode={viewMode} />
                <Quadrant title="Q4: Not Urgent & Not Important" tasks={q4} color="var(--color-text-muted)" viewMode={viewMode} />
            </div>

            {showForm && (
                <TaskModal onClose={() => setShowForm(false)} onSave={addTask} />
            )}
        </div>
    );
}

function Quadrant({ title, tasks, color, viewMode }) {
    return (
        <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            borderTop: `4px solid ${color}`,
            transition: 'all 0.3s ease'
        }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{title} <span style={{ opacity: 0.5 }}>({tasks.length})</span></h4>
            <div style={{
                overflowY: 'auto',
                paddingRight: '0.25rem',
                // base height ~ 2 items, max height ~ 3 items (approx)
                minHeight: '160px',
                maxHeight: '260px',
                display: viewMode === 'grid' ? 'grid' : 'flex',
                flexDirection: viewMode === 'list' ? 'column' : undefined,
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : undefined,
                gap: '0.5rem',
                alignContent: 'start'
            }}>
                {tasks.map(t => <TaskCard key={t.id} task={t} compact={viewMode === 'grid'} />)}
                {tasks.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>Empty</div>}
            </div>
        </div>
    );
}

function TaskModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        title: '',
        urge: false,
        imp: false,
        dueDate: '',
        context: '@home'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) return;
        onSave(form);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="glass-panel" style={{ width: '400px', padding: '2rem', borderRadius: 'var(--radius-lg)', background: '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3>Add New Task</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Task Title</label>
                        <input
                            autoFocus
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder="What needs to be done?"
                        />
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
                                <option value="@home">@home</option>
                                <option value="@work">@work</option>
                                <option value="@errands">@errands</option>
                                <option value="@computer">@computer</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Task</button>
                </form>
            </div>
        </div>
    )
}
