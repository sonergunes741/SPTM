import React from 'react';
import { useMission } from '../../../context/MissionContext';
import { Target } from 'lucide-react';

export default function MissionWidget() {
    const { getRootMissions } = useMission();
    const rootMissions = getRootMissions();
    const mission = rootMissions.length > 0 ? rootMissions[0] : null;

    if (!mission) return (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px dashed rgba(255,255,255,0.2)' }}>
            <Target className="text-muted" />
            <span style={{ color: 'var(--color-text-muted)' }}>You haven't defined your mission yet. Go to "My Mission" to start.</span>
        </div>
    );

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(30, 41, 59, 0.7))',
            border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Target size={20} color="var(--color-primary)" />
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)' }}>Current Focus</h3>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 500 }}>
                "{mission.text}"
            </p>
        </div>
    );
}
