import { useState } from "react";
import {
  LayoutDashboard,
  Target,
  Calendar as CalendarIcon,
  PieChart,
  Archive,
  Inbox,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MissionView from "./components/features/mission/MissionView";
import CoveyMatrix from "./components/features/tasks/CoveyMatrix";
import MissionWidget from "./components/features/mission/MissionWidget";
import CalendarView from "./components/features/calendar/CalendarView";
import StatsView from "./components/features/stats/StatsView";
import ArchivedTasksView from "./components/features/tasks/ArchivedTasksView";
import InboxWidget from "./components/features/inbox/InboxWidget";
import WeeklyReview from "./components/features/review/WeeklyReview";
import NotificationsWidget from "./components/features/notifications/NotificationsWidget";
import { GoogleCalendarProvider } from "./context/GoogleCalendarContext";
import GoogleCalendarLogin from "./components/features/calendar/GoogleCalendarLogin";

import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useTasks } from './context/TaskContext';
import TaskCard from './components/features/tasks/TaskCard';

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { updateTask, tasks } = useTasks();
  const [activeDragId, setActiveDragId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
        // Determine Target Quadrant
        const quadrant = over.id; // 'q1', 'q2', 'q3', 'q4'
        let updates = {};

        switch (quadrant) {
            case 'q1': updates = { urge: true, imp: true }; break;
            case 'q2': updates = { urge: false, imp: true }; break;
            case 'q3': updates = { urge: true, imp: false }; break;
            case 'q4': updates = { urge: false, imp: false }; break;
            default: return; // Dropped elsewhere
        }

        // Apply Updates: Set Priority & Remove from Inbox
        updateTask(active.id, {
            ...updates,
            isInbox: false,
            context: '@home' // Default to home context if not set, or keep existing? Let's imply 'Projectizing' it.
        });
    }
  };

  return (
    <GoogleCalendarProvider>
      <div
        className="app-shell"
        style={{ display: "flex", height: "100vh", overflow: "hidden" }}
      >
        {/* Sidebar Navigation */}
        <aside
          className="glass-panel"
          style={{
            width: isSidebarCollapsed ? "80px" : "280px",
            padding: isSidebarCollapsed ? "2rem 1rem" : "2rem",
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
          }}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: isSidebarCollapsed ? "50%" : "1rem",
              transform: isSidebarCollapsed ? "translateX(50%)" : "none",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.color = "var(--color-text-main)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <div
            style={{ 
              marginBottom: "3rem", 
              cursor: "pointer",
              textAlign: isSidebarCollapsed ? "center" : "left",
              marginTop: isSidebarCollapsed ? "2rem" : "0" // Butonla çakışmaması için
            }}
            onClick={() => setActiveTab("dashboard")}
          >
            <h1
              className="text-gradient-primary"
              style={{
                fontSize: isSidebarCollapsed ? "1.5rem" : "2rem",
                letterSpacing: "-0.03em",
                marginBottom: "0.25rem",
                transition: "all 0.3s ease",
              }}
            >
              {isSidebarCollapsed ? "S" : "SPTM"}
            </h1>
            {!isSidebarCollapsed && (
              <p
                style={{ 
                  color: "var(--color-text-muted)", 
                  fontSize: "0.85rem", 
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                Smart Personal Task Manager
              </p>
            )}
          </div>

          <nav
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <NavButton
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              collapsed={isSidebarCollapsed}
            />
            <NavButton
              active={activeTab === "mission"}
              onClick={() => setActiveTab("mission")}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d="M12 1 L13 10 L 17 6 L 14 11 L 23 12 L 14 13 L 17 18 L 13 14 L 12 23 L 11 14 L 7 18 L 10 13 L 1 12 L 10 11 L 7 6 L 11 10 Z" 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="rgba(15, 23, 42, 0.8)" 
                    />
                </svg>
              }
              label="My Mission"
              collapsed={isSidebarCollapsed}
            />
            <NavButton
              active={activeTab === "calendar"}
              onClick={() => setActiveTab("calendar")}
              icon={<CalendarIcon size={20} />}
              label="Calendar"
              collapsed={isSidebarCollapsed}
            />
            <NavButton
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
              icon={<PieChart size={20} />}
              label="Insights"
              collapsed={isSidebarCollapsed}
            />
            <NavButton
              active={activeTab === "archive"}
              onClick={() => setActiveTab("archive")}
              icon={<Archive size={20} />}
              label="Archive"
              collapsed={isSidebarCollapsed}
            />

            <div
              style={{
                marginTop: "2rem",
                marginBottom: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textAlign: isSidebarCollapsed ? "center" : "left",
                opacity: isSidebarCollapsed ? 0 : 1, // Hide title when collapsed but keep spacing? Or just hide content
                display: isSidebarCollapsed ? "none" : "block"
              }}
            >
              GTD Tools
            </div>

            {/* Separator for collapsed functionality visual clarity if needed, but spacing is cleaner */}
            {isSidebarCollapsed && <div style={{ height: "1rem" }} />}

            <NavButton
              active={activeTab === "review"}
              onClick={() => setActiveTab("review")}
              icon={<RefreshCcw size={20} />}
              label="Weekly Review"
              collapsed={isSidebarCollapsed}
            />
          </nav>

          <div
            style={{
              marginTop: "auto",
              paddingTop: "1.5rem",
              borderTop: isSidebarCollapsed ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "center"
            }}
          >
            {activeTab === "calendar" && !isSidebarCollapsed && <GoogleCalendarLogin />}
            {activeTab === "calendar" && isSidebarCollapsed && (
                // Simplified icon for login state if needed, or just hide
                <div title="Google Calendar Actions" style={{ width: "8px", height: "8px", background: "var(--color-success)", borderRadius: "50%" }} />
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
            position: "relative",
          }}
        >
          {/* Background Ambient Glow */}
          <div
            style={{
              position: "fixed",
              top: "-20%",
              right: "-10%",
              width: "600px",
              height: "600px",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />

          <header
            style={{
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ textTransform: "capitalize" }}>
                {activeTab === "archive"
                  ? "Archived Tasks"
                  : activeTab === "review"
                  ? "Weekly Review"
                  : activeTab === "mission"
                  ? "My Mission"
                  : activeTab === "context"
                  ? "Contexts"
                  : activeTab}
              </h2>
              <p style={{ color: "var(--color-text-muted)" }}>
                Manage your day with purpose.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <NotificationsWidget />
              </div>
              <div
                className="glass-panel"
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-xl)",
                  fontSize: "0.875rem",
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </header>

          {/* Content Placeholder */}
          <div className="content-area">
            {activeTab === "dashboard" && (
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem"
                }}
              >
                {/* Top Banner: Mission Compass */}
                <div style={{ flexShrink: 0 }}>
                    <MissionWidget />
                </div>

                {/* Main Workspace: Split Inbox & Matrix */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "320px 1fr", // Fixed width for inbox side panel, rest for Matrix
                    gap: "1.5rem",
                    flex: 1,
                    minHeight: 0 // Important for nested scrolling
                  }}
                >
                  <div style={{ height: "100%", overflow: "hidden" }}>
                    <InboxWidget />
                  </div>
                  <div style={{ height: "100%", overflow: "hidden" }}>
                    <CoveyMatrix />
                  </div>
                </div>
              </div>
               {/* Drag Overlay could be added here for preview if needed, but simplistic approach first */}
                <DragOverlay dropAnimation={null}>
                    {activeDragId ? (
                        <div style={{ 
                            cursor: 'grabbing',
                            opacity: 1, // Full opacity for content
                            background: 'rgba(30, 41, 59, 0.9)', // Darker background to cover underneath
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.3)', // More distinct border
                            boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), 0 8px 32px rgba(0,0,0,0.5)', // Purple glow + deep shadow
                            transform: 'scale(1.02)',
                            backdropFilter: 'blur(8px)' // Strong glass effect
                        }}>
                             <TaskCard task={tasks.find(t => t.id === activeDragId)} compact={true} />
                        </div>
                    ) : null}
                </DragOverlay>
              </DndContext>
            )}
            {activeTab === "mission" && <MissionView />}
            {activeTab === "calendar" && <CalendarView />}
            {activeTab === "stats" && <StatsView />}
            {activeTab === "archive" && <ArchivedTasksView />}
            {activeTab === "review" && <WeeklyReview />}
          </div>
        </main>
      </div>
    </GoogleCalendarProvider>
  );
}

function NavButton({ active, onClick, icon, label, collapsed }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : ""}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? "0" : "1rem",
        padding: "0.85rem 1rem",
        border: "none",
        background: active ? "linear-gradient(90deg, rgba(99, 102, 241, 0.15), transparent)" : "transparent",
        color: active ? "#a855f7" : "var(--color-text-muted)",
        borderLeft: active && !collapsed ? "3px solid #a855f7" : "3px solid transparent",
        // When collapsed, show border bottom or just box shadow? let's stick to no border or maybe right border?
        // Actually, for collapsed, a subtle glow or background is meaningful enough.
        borderRadius: collapsed ? "var(--radius-md)" : "0 var(--radius-md) var(--radius-md) 0",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: active ? 600 : 500,
        transition: "all 0.2s ease",
        textAlign: "left",
        width: "100%",
        marginLeft: collapsed ? "0" : "-1rem",
        paddingLeft: collapsed ? "1rem" : "2rem",
      }}
      onMouseEnter={(e) => {
        if (!active) {
            e.currentTarget.style.color = "var(--color-text-main)";
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.background = "transparent";
        }
      }}
    >
      <span style={{ 
          opacity: active ? 1 : 0.7, 
          transition: 'opacity 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }}>
          {icon}
      </span>
      {!collapsed && (
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {label}
          </span>
      )}
    </button>
  );
}

export default App;
