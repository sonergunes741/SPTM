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
            padding: '1.5rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1rem',
            // Deep space background with a "North Star" cool shine
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(30, 41, 59, 0.6) 50%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)'
        }}>
            {/* Custom North Star Icon & Label */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: '0.5rem', 
                color: 'white',
                minWidth: '100px',
                textAlign: 'center'
            }}>
                <div style={{ 
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.9))', 
                    marginBottom: '0.25rem'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        {/* 8-Pointed Compass Rose: 4 Main (Long), 4 Diagonal (Short) */}
                        <path d="M12 1 L13 10 L 17 6 L 14 11 L 23 12 L 14 13 L 17 18 L 13 14 L 12 23 L 11 14 L 7 18 L 10 13 L 1 12 L 10 11 L 7 6 L 11 10 Z" />
                    </svg>
                </div>
                <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px',
                    opacity: 0.9,
                    color: 'rgba(255,255,255,0.8)'
                }}>
                    North Star
                </span>
            </div>

            {/* Separator with gradient fade */}
            <div style={{ 
                width: '1px', 
                height: '40px', 
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)' 
            }}></div>

            {/* Mission Statement */}
            <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500, 
                fontFamily: 'serif', 
                fontStyle: 'italic', 
                color: 'white',
                flex: 1,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                lineHeight: 1.4
            }}>
                {mission ? `"${mission}"` : <span className="text-muted italic" style={{ fontSize: '0.9rem', fontStyle: 'normal', fontFamily: 'var(--font-sans)' }}>Define your mission in "My Mission" to set your North Star.</span>}
            </div>
        </div>
    );
}
