import React, { useState } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { X, Plus, Trash2 } from 'lucide-react';

export default function ContextManagerModal({ onClose }) {
    const { contexts, addContext, deleteContext } = useTasks();
    const [newContextName, setNewContextName] = useState('');
    const [newContextIcon, setNewContextIcon] = useState('🏷️');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newContextName.trim()) return;
        // Ensure name starts with @ if preferred, or leave as is
        let name = newContextName.trim();
        if (!name.startsWith('@')) name = '@' + name;

        addContext(name, newContextIcon);
        setNewContextName('');
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
            <div className="glass-panel" style={{ width: '400px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Manage Contexts</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}><X size={20} /></button>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '50px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Icon</span>
                        <input
                            style={{ width: '100%', padding: '0.5rem', textAlign: 'center', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            value={newContextIcon}
                            onChange={e => setNewContextIcon(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Name</span>
                        <input
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            value={newContextName}
                            onChange={e => setNewContextName(e.target.value)}
                            placeholder="@newcontext"
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.75rem', height: '36px' }} disabled={!newContextName.trim()}><Plus size={18} /></button>
                    </div>
                </form>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {contexts.length === 0 ? <span className="text-muted text-center text-sm">No custom contexts yet.</span> : null}
                    {contexts.map(ctx => (
                        <div key={ctx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <span style={{ fontSize: '1.1rem' }}>{ctx.icon}</span>
                                <span>{ctx.name}</span>
                            </span>
                            <button
                                onClick={() => deleteContext(ctx.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', opacity: 0.5, cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                                title="Delete"
                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
