import React, { useState } from 'react';
import { useMission } from '../../../context/MissionContext';
import MissionWizard from './MissionWizard';
import { Plus, Edit2, Trash2, Check, X, Compass, Target, Heart } from 'lucide-react';

export default function MissionView() {
    const {
        missions = [], addMission,
        visions = [], addVision, updateVision, deleteVision,
        values = [], addValue, updateValue, deleteValue,
        getRootMissions
    } = useMission();

    // Safety check for array methods
    const safeVisions = Array.isArray(visions) ? visions : [];
    const safeValues = Array.isArray(values) ? values : [];

    const rootMissions = getRootMissions();

    // If no data at all, show wizard
    const hasData = rootMissions.length > 0 || safeVisions.length > 0 || safeValues.length > 0;

    if (!hasData) {
        return <MissionWizard onComplete={() => { }} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            {/* Compass Section: Values & Vision */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Core Values */}
                <ListSection
                    title="Core Values"
                    icon={<Heart size={18} className="text-primary" />}
                    items={safeValues}
                    onAdd={addValue}
                    onUpdate={updateValue}
                    onDelete={deleteValue}
                    placeholder="Add a core value..."
                    emptyMessage="What principles guide you?"
                />

                {/* Vision */}
                <ListSection
                    title="Long-term Vision"
                    icon={<Compass size={18} className="text-primary" />}
                    items={safeVisions}
                    onAdd={addVision}
                    onUpdate={updateVision}
                    onDelete={deleteVision}
                    placeholder="Add a vision statement..."
                    emptyMessage="Where do you see yourself?"
                />
            </div>

            {/* Mission Statement */}
            <section>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>
                    <Target size={16} /> Personal Mission
                </h3>
                {rootMissions.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                        <button className="btn btn-primary" onClick={() => addMission('My Mission is...')}>Create Mission Statement</button>
                    </div>
                ) : (
                    rootMissions.map(mission => (
                        <MissionCard key={mission.id} mission={mission} isRoot />
                    ))
                )}
            </section>
        </div>
    );
}

function ListSection({ title, icon, items = [], onAdd, onUpdate, onDelete, placeholder, emptyMessage }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newItemText, setNewItemText] = useState('');

    const handleAdd = () => {
        if (newItemText.trim()) {
            onAdd(newItemText);
            setNewItemText('');
            setIsAdding(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    {icon} {title}
                </h3>
                <button className="btn btn-ghost" onClick={() => setIsAdding(true)} size="sm" title="Add Item">
                    <Plus size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.length === 0 && !isAdding && (
                    <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        {emptyMessage}
                    </div>
                )}

                {items.map(item => (
                    <ListItem key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
                ))}

                {isAdding && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            autoFocus
                            type="text"
                            value={newItemText}
                            onChange={e => setNewItemText(e.target.value)}
                            placeholder={placeholder}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        />
                        <button className="btn btn-ghost success" onClick={handleAdd}><Check size={16} /></button>
                        <button className="btn btn-ghost danger" onClick={() => setIsAdding(false)}><X size={16} /></button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ListItem({ item, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);

    const handleSave = () => {
        onUpdate(item.id, text);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                    autoFocus
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                />
                <button className="btn btn-ghost success" onClick={handleSave}><Check size={16} /></button>
                <button className="btn btn-ghost danger" onClick={() => setIsEditing(false)}><X size={16} /></button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ flex: 1, marginRight: '0.5rem' }}>{item.text}</span>
            <div style={{ display: 'flex', opacity: 0.7 }}>
                <button className="btn btn-ghost" onClick={() => setIsEditing(true)} style={{ padding: '0.25rem' }}><Edit2 size={14} /></button>
                <button className="btn btn-ghost" onClick={() => onDelete(item.id)} style={{ padding: '0.25rem', color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
            </div>
        </div>
    );
}

function MissionCard({ mission, isRoot }) {
    const { updateMission, deleteMission, addMission, getSubMissions } = useMission();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(mission.text);
    const subMissions = getSubMissions(mission.id);

    const handleSave = () => {
        updateMission(mission.id, editText);
        setIsEditing(false);
    };

    const handleAddChild = () => {
        const text = prompt("Enter a new Role or Goal linked to this mission:");
        if (text) addMission(text, mission.id);
    };

    return (
        <div className="glass-panel" style={{
            padding: isRoot ? '2rem' : '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1rem',
            borderLeft: isRoot ? '4px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    {isEditing ? (
                        <div>
                            <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                style={{ width: '100%', minHeight: '100px', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button className="btn btn-primary" onClick={handleSave} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Save</button>
                                <button className="btn btn-ghost" onClick={() => setIsEditing(false)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ fontSize: isRoot ? '1.5rem' : '1.1rem', lineHeight: 1.4, fontWeight: isRoot ? 600 : 400 }}>
                            {mission.text}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn btn-ghost" onClick={() => setIsEditing(true)} title="Edit">
                        <Edit2 size={16} />
                    </button>
                    <button className="btn btn-ghost" onClick={handleAddChild} title="Add Sub-goal">
                        <Plus size={16} />
                    </button>
                    {!isRoot && (
                        <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => deleteMission(mission.id)} title="Delete">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Sub-Missions Renderer */}
            {(subMissions.length > 0 || isRoot) && (
                <div style={{ marginTop: '1.5rem', paddingLeft: '1rem' }}>
                    {isRoot && subMissions.length === 0 && (
                        <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Break down your mission into specific roles or key areas.
                        </div>
                    )}
                    {subMissions.map(sub => (
                        <MissionCard key={sub.id} mission={sub} isRoot={false} />
                    ))}
                </div>
            )}
        </div>
    );
}
