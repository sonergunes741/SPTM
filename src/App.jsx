import { useState } from 'react'
import { LayoutDashboard, Target, Calendar as CalendarIcon, PieChart, Archive } from 'lucide-react'
import MissionView from './components/features/mission/MissionView'
import CoveyMatrix from './components/features/tasks/CoveyMatrix'
import MissionWidget from './components/features/mission/MissionWidget'
import CalendarView from './components/features/calendar/CalendarView'
import StatsView from './components/features/stats/StatsView'
import ArchivedTasksView from './components/features/tasks/ArchivedTasksView'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{ width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ marginBottom: '3rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <h1 style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, var(--color-primary) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SPTM
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Personal Task Manager</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavButton
            active={activeTab === 'mission'}
            onClick={() => setActiveTab('mission')}
            icon={<Target size={20} />}
            label="My Mission"
          />
          <NavButton
            active={activeTab === 'calendar'}
            onClick={() => setActiveTab('calendar')}
            icon={<CalendarIcon size={20} />}
            label="Calendar"
          />
          <NavButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<PieChart size={20} />}
            label="Insights"
          />
          <NavButton
            active={activeTab === 'archive'}
            onClick={() => setActiveTab('archive')}
            icon={<Archive size={20} />}
            label="Archive"
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', position: 'relative' }}>
        {/* Background Ambient Glow */}
        <div style={{
          position: 'fixed',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: -1
        }} />

        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ textTransform: 'capitalize' }}>{activeTab === 'archive' ? 'Archived Tasks' : activeTab}</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Manage your day with purpose.</p>
          </div>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Content Placeholder */}
        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <MissionWidget />
              <div style={{ flex: 1 }}>
                <CoveyMatrix />
              </div>
            </div>
          )}
          {activeTab === 'mission' && <MissionView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'stats' && <StatsView />}
          {activeTab === 'archive' && <ArchivedTasksView />}
        </div>
      </main>
    </div>
  )
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        border: 'none',
        background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s',
        textAlign: 'left',
        width: '100%'
      }}
    >
      {icon}
      {label}
    </button>
  )
}

export default App
