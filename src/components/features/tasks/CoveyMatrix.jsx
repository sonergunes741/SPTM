import React, { useState } from 'react';
import { useTasks } from '../../../context/TaskContext';
import TaskCard from './TaskCard';
import { Plus, X } from 'lucide-react';

export default function CoveyMatrix() {
    const { tasks, addTask } = useTasks();
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // For editing logic if needed

    // Filtering Logic
    const q1 = tasks.filter(t => t.urge && t.imp && t.status !== 'done');
    const q2 = tasks.filter(t => !t.urge && t.imp && t.status !== 'done');
    const q3 = tasks.filter(t => t.urge && !t.imp && t.status !== 'done');
    const q4 = tasks.filter(t => !t.urge && !t.imp && t.status !== 'done');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Priorities Matrix</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} /> New Task
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '1rem',
                flex: 1,
                minHeight: '600px'
            }}>
                <Quadrant title="Q1: Urgent & Important" tasks={q1} color="var(--color-danger)" />
                <Quadrant title="Q2: Not Urgent & Important" tasks={q2} color="var(--color-primary)" />
                <Quadrant title="Q3: Urgent & Not Important" tasks={q3} color="var(--color-warning)" />
                <Quadrant title="Q4: Not Urgent & Not Important" tasks={q4} color="var(--color-text-muted)" />
            </div>

            {showForm && (
                <TaskModal onClose={() => setShowForm(false)} onSave={addTask} />
            )}
        </div>
    );
}

function Quadrant({ title, tasks, color }) {
    return (
        <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            borderTop: `4px solid ${color}`
        }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{title} <span style={{ opacity: 0.5 }}>({tasks.length})</span></h4>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
                {tasks.map(t => <TaskCard key={t.id} task={t} />)}
                {tasks.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>Empty</div>}
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
