import React, { useState } from 'react';
import { useMission } from '../../../context/MissionContext';
import MissionWizard from './MissionWizard';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, Compass, Target, Heart } from 'lucide-react';

export default function MissionView() {
    const { missions, addMission, vision, setVision, values, setValues, getRootMissions, getSubMissions } = useMission();
    const rootMissions = getRootMissions();

    // If no data at all, show wizard
    const hasData = rootMissions.length > 0 || vision || values;

    if (!hasData) {
        return <MissionWizard onComplete={() => { }} />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

            {/* Compass Section: Values & Vision */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Core Values */}
                <EditableSection
                    title="Core Values"
                    icon={<Heart size={18} className="text-primary" />}
                    content={values}
                    onSave={setValues}
                    placeholder="Define your core principles..."
                    minHeight="150px"
                />

                {/* Vision */}
                <EditableSection
                    title="Long-term Vision"
                    icon={<Compass size={18} className="text-primary" />}
                    content={vision}
                    onSave={setVision}
                    placeholder="Where are you going?"
                    minHeight="150px"
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

            {/* Key Roles / Goals Section (Handled within MissionCard hierarchy mainly) */}
        </div>
    );
}

function EditableSection({ title, icon, content, onSave, placeholder, minHeight }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState(content);

    const handleSave = () => {
        onSave(tempContent);
        setIsEditing(false);
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    {icon} {title}
                </h3>
                {!isEditing && (
                    <button className="btn btn-ghost" onClick={() => { setTempContent(content); setIsEditing(true); }} size="sm">
                        <Edit2 size={14} />
                    </button>
                )}
            </div>

            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
                    <textarea
                        value={tempContent}
                        onChange={e => setTempContent(e.target.value)}
                        placeholder={placeholder}
                        style={{
                            flex: 1,
                            minHeight: minHeight,
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.75rem',
                            color: 'white',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
                        <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => { if (window.confirm('Clear section?')) { onSave(''); setTempContent(''); setIsEditing(false); } }} title="Clear Section">
                            <Trash2 size={16} />
                        </button>
                        <div style={{ flex: 1 }}></div>
                        <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            ) : (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: content ? 'var(--color-text-main)' : 'var(--color-text-muted)', fontStyle: content ? 'normal' : 'italic' }}>
                    {content || placeholder}
                </div>
            )}
        </div>
    );
}

function MissionCard({ mission, isRoot }) {
    const { updateMission, deleteMission, addMission, getSubMissions } = useMission();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(mission.text);
    const [isExpanded, setIsExpanded] = useState(true);
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
