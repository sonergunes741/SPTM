import React, { useState } from 'react';
import { useMission } from '../../../context/MissionContext';
import { Target, Compass, Heart } from 'lucide-react';

export default function MissionWidget() {
    const { getRootMissions, vision, values } = useMission();
    const rootMissions = getRootMissions();
    const mission = rootMissions.length > 0 ? rootMissions[0]?.text : '';

    const [activeTab, setActiveTab] = useState('mission');

    // If nothing defined, show placeholder
    if (!mission && !vision && !values) return (
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px dashed rgba(255,255,255,0.2)' }}>
            <Target className="text-muted" />
            <span style={{ color: 'var(--color-text-muted)' }}>You haven't defined your compass yet. Go to "My Mission" to start.</span>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'mission':
                return mission ? `"${mission}"` : <span className="text-muted italic">No mission statement defined.</span>;
            case 'vision':
                return vision ? vision : <span className="text-muted italic">No vision defined.</span>;
            case 'values':
                return values ? values : <span className="text-muted italic">No core values defined.</span>;
            default:
                return null;
        }
    };

    const getIcon = () => {
        switch (activeTab) {
            case 'mission': return <Target size={20} color="var(--color-primary)" />;
            case 'vision': return <Compass size={20} color="#a855f7" />;
            case 'values': return <Heart size={20} color="#ec4899" />;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'mission': return "Current Mission";
            case 'vision': return "Long-term Vision";
            case 'values': return "Core Values";
        }
    };

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {getIcon()}
                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)' }}>
                        {getTitle()}
                    </h3>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                    <button onClick={() => setActiveTab('mission')} className={`btn-ghost ${activeTab === 'mission' ? 'active' : ''}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: activeTab === 'mission' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: activeTab === 'mission' ? 'white' : 'var(--color-text-muted)' }} title="Mission"><Target size={14} /></button>
                    <button onClick={() => setActiveTab('vision')} className={`btn-ghost ${activeTab === 'vision' ? 'active' : ''}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: activeTab === 'vision' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: activeTab === 'vision' ? 'white' : 'var(--color-text-muted)' }} title="Vision"><Compass size={14} /></button>
                    <button onClick={() => setActiveTab('values')} className={`btn-ghost ${activeTab === 'values' ? 'active' : ''}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: activeTab === 'values' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: activeTab === 'values' ? 'white' : 'var(--color-text-muted)' }} title="Values"><Heart size={14} /></button>
                </div>
            </div>

            <div style={{ fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 500, minHeight: '3rem' }}>
                {renderContent()}
            </div>
        </div>
    );
}
