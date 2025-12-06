import React, { useState } from 'react';
import { useTasks } from '../../../context/TaskContext';
import { useMission } from '../../../context/MissionContext';
import { CheckCircle2, Circle, RefreshCcw, ChevronRight, ChevronDown, Brain, Target, ListTodo, Archive } from 'lucide-react';

export default function WeeklyReview() {
    const { tasks, archiveTask } = useTasks();
    const { visions, values, missions } = useMission();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [expandedStep, setExpandedStep] = useState(0);

    const reviewSteps = [
        {
            id: 'collect',
            title: 'Collect & Capture',
            icon: Brain,
            description: 'Review all open loops, notes, and ideas. Capture anything on your mind.',
            action: 'Have you captured all pending thoughts and tasks?',
            color: '#a855f7'
        },
        {
            id: 'process',
            title: 'Process Inbox',
            icon: ListTodo,
            description: 'Process each item in your inbox. Decide: Do it, Delegate it, Defer it, or Delete it.',
            action: 'Is your inbox empty or processed?',
            color: '#3b82f6',
            stats: () => {
                const inboxCount = tasks.filter(t => t.isInbox && !t.isArchived && t.status !== 'done').length;
                return inboxCount > 0
                    ? `${inboxCount} items still in inbox`
                    : 'Inbox is clear! ✓';
            }
        },
        {
            id: 'review-actions',
            title: 'Review Next Actions',
            icon: Target,
            description: 'Review your current tasks. Mark completed ones, update or remove stale ones.',
            action: 'Are all tasks current and actionable?',
            color: '#10b981',
            stats: () => {
                const pending = tasks.filter(t => !t.isArchived && t.status !== 'done').length;
                const overdue = tasks.filter(t => {
                    if (t.isArchived || t.status === 'done' || !t.dueDate) return false;
                    return new Date(t.dueDate) < new Date();
                }).length;
                return `${pending} pending tasks${overdue > 0 ? `, ${overdue} overdue` : ''}`;
            }
        },
        {
            id: 'review-calendar',
            title: 'Review Calendar',
            icon: RefreshCcw,
            description: 'Look at upcoming week. Any meetings that need preparation? Any deadlines approaching?',
            action: 'Have you looked at your calendar for the coming week?',
            color: '#f59e0b',
            stats: () => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                const upcoming = tasks.filter(t => {
                    if (t.isArchived || t.status === 'done' || !t.dueDate) return false;
                    const dueDate = new Date(t.dueDate);
                    return dueDate >= new Date() && dueDate <= nextWeek;
                }).length;
                return `${upcoming} tasks due this week`;
            }
        },
        {
            id: 'review-mission',
            title: 'Review Mission & Goals',
            icon: Target,
            description: 'Reflect on your mission statement, values, and long-term vision. Are your tasks aligned?',
            action: 'Are your current priorities aligned with your mission?',
            color: '#ec4899',
            stats: () => {
                const linked = tasks.filter(t => !t.isArchived && t.missionId).length;
                const total = tasks.filter(t => !t.isArchived).length;
                const pct = total > 0 ? Math.round((linked / total) * 100) : 0;
                return `${pct}% of tasks linked to mission`;
            }
        },
        {
            id: 'cleanup',
            title: 'Clean Up & Archive',
            icon: Archive,
            description: 'Archive completed tasks, clean up your workspace, and prepare for the week ahead.',
            action: 'Ready to start the new week with clarity?',
            color: '#6366f1',
            stats: () => {
                const completedNotArchived = tasks.filter(t => t.status === 'done' && !t.isArchived).length;
                return completedNotArchived > 0
                    ? `${completedNotArchived} completed tasks to archive`
                    : 'All clean! ✓';
            }
        }
    ];

    const markStepComplete = (stepId) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps([...completedSteps, stepId]);
        }
        // Move to next step
        if (currentStep < reviewSteps.length - 1) {
            setCurrentStep(currentStep + 1);
            setExpandedStep(currentStep + 1);
        }
    };

    const toggleStep = (index) => {
        setExpandedStep(expandedStep === index ? -1 : index);
    };

    const progress = Math.round((completedSteps.length / reviewSteps.length) * 100);
    const isComplete = completedSteps.length === reviewSteps.length;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div className="glass-panel" style={{
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>📋 Weekly Review</h3>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            GTD methodology: Clear your mind, process inputs, review commitments
                        </p>
                    </div>
                    {isComplete && (
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            color: '#10b981',
                            fontSize: '0.85rem',
                            fontWeight: 600
                        }}>
                            ✅ Review Complete!
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        flex: 1,
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {completedSteps.length}/{reviewSteps.length}
                    </span>
                </div>
            </div>

            {/* Review Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reviewSteps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isExpanded = expandedStep === index;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.id}
                            className="glass-panel"
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                borderLeft: `4px solid ${isCompleted ? '#10b981' : step.color}`,
                                opacity: isCompleted ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Step Header */}
                            <div
                                onClick={() => toggleStep(index)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent'
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: 'var(--radius-md)',
                                    background: isCompleted
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : `${step.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isCompleted ? (
                                        <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                                    ) : (
                                        <Icon size={18} style={{ color: step.color }} />
                                    )}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        textDecoration: isCompleted ? 'line-through' : 'none',
                                        opacity: isCompleted ? 0.7 : 1
                                    }}>
                                        {step.title}
                                    </div>
                                    {step.stats && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                            {step.stats()}
                                        </div>
                                    )}
                                </div>

                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>

                            {/* Step Content */}
                            {isExpanded && !isCompleted && (
                                <div style={{
                                    padding: '0 1.5rem 1.5rem 1.5rem',
                                    borderTop: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <p style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.9rem',
                                        marginTop: '1rem',
                                        marginBottom: '1rem',
                                        lineHeight: 1.6
                                    }}>
                                        {step.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <span style={{ fontSize: '0.9rem' }}>{step.action}</span>
                                        <button
                                            onClick={() => markStepComplete(step.id)}
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                        >
                                            Done ✓
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Summary */}
            <div className="glass-panel" style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                marginTop: '1.5rem'
            }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    Quick Overview
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <StatBox
                        label="Active Tasks"
                        value={tasks.filter(t => !t.isArchived && t.status !== 'done').length}
                        color="#6366f1"
                    />
                    <StatBox
                        label="Completed"
                        value={tasks.filter(t => t.status === 'done').length}
                        color="#10b981"
                    />
                    <StatBox
                        label="Visions"
                        value={visions.length}
                        color="#f59e0b"
                    />
                    <StatBox
                        label="Roles"
                        value={missions.length}
                        color="#ec4899"
                    />
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, color }) {
    return (
        <div style={{
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{label}</div>
        </div>
    );
}
