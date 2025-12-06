import React, { useState } from 'react';
import { useMission } from '../../../context/MissionContext';
import { Target, Compass, Heart } from 'lucide-react';

export default function MissionWidget() {
    const { getRootMissions, visions = [], values = [] } = useMission();
    const rootMissions = getRootMissions();
    const mission = rootMissions.length > 0 ? rootMissions[0]?.text : '';

    // If nothing defined, show placeholder
    const hasData = mission || visions.length > 0 || values.length > 0;
    if (!hasData) return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px dashed rgba(255,255,255,0.2)' }}>
            <Target className="text-muted" />
            <span style={{ color: 'var(--color-text-muted)' }}>You haven't defined your compass yet. Go to "My Mission" to start.</span>
        </div>
    );

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr', // Give Mission slightly more space
            gap: '2rem'
        }}>
            {/* Mission Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Target size={16} color="var(--color-primary)" /> Current Mission
                </div>
                <div style={{ fontSize: '1.1rem', lineHeight: 1.4, fontWeight: 600 }}>
                    {mission ? `"${mission}"` : <span className="text-muted italic" style={{ fontSize: '0.9rem', fontWeight: 400 }}>No mission statement defined.</span>}
                </div>
            </div>

            {/* Vision Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Compass size={16} color="#a855f7" /> Vision
                </div>
                {visions.length > 0 ? (
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {visions.slice(0, 3).map(v => <li key={v.id}>{v.text}</li>)}
                        {visions.length > 3 && <li>+ {visions.length - 3} more</li>}
                    </ul>
                ) : <span className="text-muted italic" style={{ fontSize: '0.9rem' }}>No vision defined.</span>}
            </div>

            {/* Values Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Heart size={16} color="#ec4899" /> Core Values
                </div>
                {values.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {values.slice(0, 5).map(v => (
                            <span key={v.id} style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.8rem', color: '#fbcfe8', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                                {v.text}
                            </span>
                        ))}
                        {values.length > 5 && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>+ {values.length - 5}</span>}
                    </div>
                ) : <span className="text-muted italic" style={{ fontSize: '0.9rem' }}>No values defined.</span>}
            </div>
        </div>
    );
}
