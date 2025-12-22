import React from 'react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';
import { PieChart, Target, CheckCircle, Clock, Inbox, Compass } from 'lucide-react';

export default function StatsView() {
    const { tasks } = useTasks();
    const { missions: allMissions, getRootMissions, visions, values } = useMission();
    const missions = getRootMissions();
    const [filterMissionId, setFilterMissionId] = React.useState('all');
    const [showMissionSelector, setShowMissionSelector] = React.useState(false);

    // 1. GLOBAL METRICS (For top cards, matrix, and contexts)
    const globalTasks = tasks.filter(t => !t.isArchived);
    const globalTotal = globalTasks.length;
    const globalCompleted = globalTasks.filter(t => t.status === 'done').length;
    const globalRate = globalTotal === 0 ? 0 : Math.round((globalCompleted / globalTotal) * 100);
    const globalInbox = globalTasks.filter(t => t.isInbox && t.status !== 'done').length;

    // Covey Matrix (Global)
    const q1Global = globalTasks.filter(t => t.urge && t.imp && t.status !== 'done').length;
    const q2Global = globalTasks.filter(t => !t.urge && t.imp && t.status !== 'done').length;
    const q3Global = globalTasks.filter(t => t.urge && !t.imp && t.status !== 'done').length;
    const q4Global = globalTasks.filter(t => !t.urge && !t.imp && t.status !== 'done' && !t.isInbox).length;

    // Context counts (Global)
    const contextCounts = {
        '@home': globalTasks.filter(t => t.context === '@home').length,
        '@work': globalTasks.filter(t => t.context === '@work').length,
        '@computer': globalTasks.filter(t => t.context === '@computer').length,
        '@phone': globalTasks.filter(t => t.context === '@phone').length,
        '@errands': globalTasks.filter(t => t.context === '@errands').length,
        '@waiting': globalTasks.filter(t => t.context === '@waiting').length,
        '@anywhere': globalTasks.filter(t => t.context === '@anywhere').length
    };

    // Subtask stats (Global)
    const tasksWithSubtasks = globalTasks.filter(t => t.subtasks && t.subtasks.length > 0);
    const totalSubtasks = tasksWithSubtasks.reduce((acc, t) => acc + t.subtasks.length, 0);
    const completedSubtasks = tasksWithSubtasks.reduce((acc, t) => acc + t.subtasks.filter(s => s.completed).length, 0);

    // Alignment (Global)
    const linkedTasks = globalTasks.filter(t => t.missionId && t.status !== 'done').length;
    const unlinkedTasks = globalTasks.filter(t => !t.missionId && t.status !== 'done' && !t.isInbox).length;

    // 2. WEEKLY REVIEW METRICS (Filtered by mission)
    const filteredTasks = filterMissionId === 'all' 
        ? tasks 
        : tasks.filter(t => t.missionId === filterMissionId);
    const reviewActiveTasks = filteredTasks.filter(t => !t.isArchived);
    const reviewTotal = reviewActiveTasks.length;
    const reviewCompleted = reviewActiveTasks.filter(t => t.status === 'done').length;
    const reviewRate = reviewTotal === 0 ? 0 : Math.round((reviewCompleted / reviewTotal) * 100);

    // Calculate finished submissions (sub-missions)
    const finishedSubmissions = React.useMemo(() => {
        const subMissions = allMissions.filter(m => m.parentId);
        const relevantSubs = filterMissionId === 'all' 
            ? subMissions 
            : subMissions.filter(sm => sm.parentId === filterMissionId);

        return relevantSubs.filter(sm => {
            const smTasks = tasks.filter(t => t.missionId === sm.id);
            return smTasks.length > 0 && smTasks.every(t => t.status === 'done');
        });
    }, [allMissions, tasks, filterMissionId]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <PieChart size={24} style={{ color: '#bae6fd' }} />
                </div>
                <div>
                     <h2 className="text-gradient-primary" style={{ fontSize: '1.75rem', margin: 0 }}>Productivity Insights</h2>
                     <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Holistic overview of your task ecosystem.</p>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <StatCard 
                    title="Completion Rate" 
                    value={`${globalRate}%`} 
                    sub={`of ${globalTotal} active tasks`} 
                    color="var(--color-primary)" 
                    icon={<Target size={20} />}
                />
                <StatCard 
                    title="Completed" 
                    value={globalCompleted} 
                    color="#10b981" 
                    icon={<CheckCircle size={20} />}
                />
                <StatCard 
                    title="In Progress" 
                    value={globalTotal - globalCompleted - globalInbox} 
                    color="#f59e0b" 
                    icon={<Clock size={20} />}
                />
                <StatCard 
                    title="In Inbox" 
                    value={globalInbox} 
                    color="#a855f7" 
                    icon={<Inbox size={20} />}
                />

            </div>

            {/* Two Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* GTD Context Distribution */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                         <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>📍</span> Context Distribution
                         </h4>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.entries(contextCounts).map(([context, count]) => (
                            <ProgressBar
                                key={context}
                                label={context}
                                value={count}
                                total={globalTotal}
                                color={getContextColor(context)}
                            />
                        ))}
                    </div>
                </div>

                {/* Covey Matrix Breakdown */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>📊 Covey Matrix Breakdown</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <ProgressBar label="Q1: Urgent & Important" value={q1Global} total={q1Global + q2Global + q3Global + q4Global} color="#ef4444" />
                        <ProgressBar label="Q2: Not Urgent & Important" value={q2Global} total={q1Global + q2Global + q3Global + q4Global} color="#6366f1" />
                        <ProgressBar label="Q3: Urgent & Not Important" value={q3Global} total={q1Global + q2Global + q3Global + q4Global} color="#f59e0b" />
                        <ProgressBar label="Q4: Neither" value={q4Global} total={q1Global + q2Global + q3Global + q4Global} color="#94a3b8" />
                    </div>
                </div>
            </div>

            {/* Mission Alignment & Subtasks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Mission Alignment */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>🎯 Mission Alignment</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: `conic-gradient(#6366f1 ${linkedTasks / (linkedTasks + unlinkedTasks) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 0.5rem'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: '#1e293b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '1.1rem'
                                }}>
                                    {linkedTasks + unlinkedTasks > 0 ? Math.round((linkedTasks / (linkedTasks + unlinkedTasks)) * 100) : 0}%
                                </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Linked to Mission</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: '#6366f1', fontWeight: 600 }}>{linkedTasks}</span> linked
                            </div>
                            <div>
                                <span style={{ color: '#94a3b8', fontWeight: 600 }}>{unlinkedTasks}</span> unlinked
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtasks Progress */}
                <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>✅ Checklist Progress</h4>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981' }}>
                            {completedSubtasks}/{totalSubtasks}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            subtasks completed
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%`,
                                background: '#10b981',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                            {tasksWithSubtasks.length} tasks have checklists
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Review Section - Redesigned */}
            <div className="glass-panel" style={{ 
                padding: '2.5rem', 
                borderRadius: '24px', 
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)', // Koyu Lacivert (Dark Navy)
                border: '1px solid rgba(168, 85, 247, 0.15)',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                marginTop: '1rem'
            }}>
                {/* Decorative Glow */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Section Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                borderRadius: '14px', 
                                background: 'rgba(168, 85, 247, 0.12)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: '#a855f7',
                                border: '1px solid rgba(168, 85, 247, 0.2)'
                            }}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-gradient-primary" style={{ 
                                    fontSize: '2rem', 
                                    fontWeight: 800, 
                                    margin: 0, 
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1
                                }}>
                                    Weekly Review
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
                                    Retrospective analysis and mission performance audit.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Focus area filter</span>
                            <button
                                onClick={() => setShowMissionSelector(!showMissionSelector)}
                                className="glass-panel"
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: 'var(--radius-xl)',
                                    background: 'rgba(255,255,255,0.03)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    minWidth: '220px',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Target size={16} color={filterMissionId === 'all' ? 'var(--color-text-muted)' : '#a855f7'} />
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                                        {filterMissionId === 'all' ? 'All Missions' : missions.find(m => m.id === filterMissionId)?.text || 'Selected Mission'}
                                    </span>
                                </div>
                                <Compass size={16} style={{ transform: showMissionSelector ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                            </button>

                            {showMissionSelector && (
                                <>
                                    <div 
                                        style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                                        onClick={() => setShowMissionSelector(false)} 
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 0.5rem)',
                                        right: 0,
                                        width: '280px',
                                        background: 'rgba(15, 23, 42, 0.95)',
                                        backdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 'var(--radius-lg)',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
                                        zIndex: 50,
                                        overflow: 'hidden',
                                        padding: '0.5rem'
                                    }}>
                                        <button
                                            onClick={() => { setFilterMissionId('all'); setShowMissionSelector(false); }}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: filterMissionId === 'all' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                                border: 'none',
                                                color: filterMissionId === 'all' ? '#a855f7' : 'white',
                                                textAlign: 'left',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = filterMissionId === 'all' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = filterMissionId === 'all' ? 'rgba(168, 85, 247, 0.1)' : 'transparent'}
                                        >
                                            <Target size={14} />
                                            <span>All Missions</span>
                                        </button>
                                        
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

                                        <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            {missions.map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => { setFilterMissionId(m.id); setShowMissionSelector(false); }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        background: filterMissionId === m.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                                        border: 'none',
                                                        color: filterMissionId === m.id ? '#a855f7' : 'var(--color-text-muted)',
                                                        textAlign: 'left',
                                                        borderRadius: 'var(--radius-md)',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.75rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = filterMissionId === m.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.05)';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = filterMissionId === m.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent';
                                                        e.currentTarget.style.color = filterMissionId === m.id ? '#a855f7' : 'var(--color-text-muted)';
                                                    }}
                                                >
                                                    <div style={{ minWidth: '14px' }}>
                                                        <Compass size={14} />
                                                    </div>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {m.text}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Report Content */}
                    {filterMissionId === 'all' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {/* Top Stats Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {/* Global Rate Card */}
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Global Completion</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>{reviewRate}%</div>
                                </div>
                                {/* Completed Missions Card */}
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Completed Missions</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#a855f7' }}>
                                        {missions.filter(m => {
                                            const mTasks = tasks.filter(t => t.missionId === m.id);
                                            return mTasks.length > 0 && mTasks.every(t => t.status === 'done');
                                        }).length}
                                    </div>
                                </div>
                            </div>

                            {/* Mission Distribution Grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    {missions.filter(m => tasks.some(t => t.missionId === m.id)).map(mission => {
                                        const missionTasks = tasks.filter(t => t.missionId === mission.id);
                                        const doneCount = missionTasks.filter(t => t.status === 'done').length;
                                        const rate = missionTasks.length > 0 ? Math.round((doneCount / missionTasks.length) * 100) : 0;
                                        const isComplete = rate === 100;
                                        return (
                                            <div key={mission.id} style={{ 
                                                padding: '1.5rem', 
                                                background: isComplete ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255,255,255,0.02)', 
                                                borderRadius: '16px', 
                                                border: isComplete ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                                {isComplete && (
                                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '40px', height: '40px', background: 'rgba(168, 85, 247, 0.2)', transform: 'rotate(45deg)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '5px' }}>
                                                        <CheckCircle size={10} color="#a855f7" />
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <Target size={16} color={isComplete ? '#a855f7' : 'var(--color-text-muted)'} />
                                                        <span style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{mission.text}</span>
                                                    </div>
                                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isComplete ? '#10b981' : (rate > 50 ? '#10b981' : 'white') }}>{rate}%</span>
                                                </div>
                                                <div>
                                                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                                        <div style={{ 
                                                            height: '100%', 
                                                            width: `${rate}%`, 
                                                            background: isComplete ? 'linear-gradient(90deg, #a855f7, #c084fc)' : 'linear-gradient(90deg, #10b981, #34d399)',
                                                            opacity: isComplete ? 1 : 0.8
                                                        }} />
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: isComplete ? '#10b981' : 'var(--color-text-muted)', fontWeight: 600 }}>
                                                        {doneCount} / {missionTasks.length} done
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Full Width: Mission Context */}
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                                        <Target size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Mission</span>
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
                                    {missions.find(m => m.id === filterMissionId)?.text}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {/* Performance */}
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '100px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                            <Clock size={18} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance</span>
                                    </div>
                                    
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '4rem', fontWeight: 900, color: '#10b981', letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '1.5rem' }}>
                                        {reviewRate}<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>%</span>
                                    </div>

                                    <div style={{ marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                {reviewCompleted} {reviewCompleted === 1 ? 'Task' : 'Tasks'} Done
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                            <div style={{ 
                                                height: '100%', 
                                                width: `${reviewRate}%`, 
                                                background: 'linear-gradient(90deg, #10b981, #34d399)',
                                                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                                            }} />
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                {/* Completed Submissions */}
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                            <CheckCircle size={18} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Submissions</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                        {finishedSubmissions.slice(0, 3).map(sub => (
                                            <div key={sub.id} style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                gap: '0.4rem',
                                                padding: '0.75rem 1rem',
                                                background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.05), transparent)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(168, 85, 247, 0.1)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a855f7' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.text}</span>
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Done</div>
                                            </div>
                                        ))}
                                        {finishedSubmissions.length === 0 && (
                                            <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.85rem', padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                                                No submissions completed in this period.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getContextColor(context) {
    const colors = {
        '@home': '#f472b6',
        '@work': '#60a5fa',
        '@computer': '#a78bfa',
        '@phone': '#34d399',
        '@errands': '#fbbf24',
        '@waiting': '#94a3b8',
        '@anywhere': '#22d3d1'
    };
    return colors[context] || '#94a3b8';
}

function StatCard({ title, value, sub, color, icon }) {
    return (
        <div className="glass-panel" style={{ 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)', 
            display: 'flex', 
            flexDirection: 'column', 
            position: 'relative', 
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                opacity: 0.1, 
                color: color, 
                transform: 'scale(1.5)' 
            }}>
                {icon}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                    padding: '0.25rem', 
                    borderRadius: '4px', 
                    background: `${color}20`, 
                    display: 'flex', 
                    color: color 
                }}>
                    {icon}
                </div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{title}</span>
            </div>
            
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{value}</span>
            {sub && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{sub}</span>}
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
