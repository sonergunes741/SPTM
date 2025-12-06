import React from 'react';
import { useGamification } from '../../../context/GamificationContext';
import { Zap, Trophy } from 'lucide-react';

export default function LevelWidget() {
    const { level, getXpProgress } = useGamification();
    const { current, required, percentage } = getXpProgress();

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.1))',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column', // Changed to column for better stack
            gap: '1rem',
            height: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                    }}>
                        {level}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>Current Level</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Productivity Novice</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{current}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}> / {required} XP</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    width: `${Math.min(percentage, 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))',
                    transition: 'width 0.5s ease-out',
                    boxShadow: '0 0 10px var(--color-primary)'
                }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '-0.5rem' }}>
                <span>Next reward: Level {level + 1} Badge</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Zap size={12} fill="currentColor" /> Keep going!</span>
            </div>
        </div>
    );
}
