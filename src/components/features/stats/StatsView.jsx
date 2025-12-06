import React from 'react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';
import { useGamification } from '../../../context/GamificationContext';

export default function StatsView() {
    const { tasks } = useTasks();
    const { missions } = useMission();
    const { history } = useGamification();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const urgentTasks = tasks.filter(t => t.urge).length;
    const importantTasks = tasks.filter(t => t.imp).length;

    // Mission alignment (tasks linked to a mission - assuming we add that linkage later, 
    // currently we don't have missionId in the form create, but let's mock the stat for now or show distribution context)
    const homeTasks = tasks.filter(t => t.context === '@home').length;
    const workTasks = tasks.filter(t => t.context === '@work').length;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '2rem' }}>Productivity Insights</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Completion Rate" value={`${completionRate}%`} sub={`of ${totalTasks} tasks`} color="var(--color-primary)" />
                <StatCard title="Completed" value={completedTasks} color="var(--color-success)" />
                <StatCard title="Pending" value={totalTasks - completedTasks} color="var(--color-warning)" />
                <StatCard title="Missions Active" value={missions.length} color="var(--color-text-main)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Task Context Distribution</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ProgressBar label="@home" value={homeTasks} total={totalTasks} color="#f472b6" />
                        <ProgressBar label="@work" value={workTasks} total={totalTasks} color="#60a5fa" />
                        <ProgressBar label="Others" value={totalTasks - homeTasks - workTasks} total={totalTasks} color="#94a3b8" />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1.5rem' }}>Covey Matrix Breakdown</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span>Urgent Tasks</span>
                            <span>{urgentTasks}</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(urgentTasks / totalTasks) * 100}%`, background: 'var(--color-danger)' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
                            <span>Important Tasks</span>
                            <span>{importantTasks}</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(importantTasks / totalTasks) * 100}%`, background: 'var(--color-primary)' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* XP History Log */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ marginBottom: '1.5rem' }}>Recent Achievements</h4>
                {history.length === 0 ? (
                    <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No achievements recorded yet. Complete tasks to gain XP!</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {history.map(entry => (
                            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                                <span>{entry.source}</span>
                                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>+{entry.amount} XP</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, sub, color }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: color }}>{value}</span>
            {sub && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{sub}</span>}
        </div>
    )
}

function ProgressBar({ label, value, total, color }) {
    const pct = total === 0 ? 0 : Math.round((value / total) * 100);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span>{label}</span>
                <span>{value} ({pct}%)</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color }} />
            </div>
        </div>
    )
}
