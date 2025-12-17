import { useState } from "react";
// Unused icons removed
import { Settings } from "lucide-react";
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


import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useTasks } from './context/TaskContext';
import TaskCard from './components/features/tasks/TaskCard';
import Sidebar from "./components/layout/Sidebar";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { updateTask, tasks } = useTasks();
  const [activeDragId, setActiveDragId] = useState(null);

  // Removed isSidebarCollapsed state from here as it is now managed in Sidebar component 
  // OR if we want to sync Main content, we would need it here. 
  // But Sidebar component manages its own width. Main content is flex:1, so it adapts automatically.

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
        context: '@home' // Default
      });
    }
  };

  return (
    <GoogleCalendarProvider>
      <div
        className="app-shell"
        style={{ display: "flex", height: "100vh", overflow: "hidden" }}
      >
        {/* Sidebar Component */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
                      : activeTab === "stats"
                        ? "Insights"
                        : activeTab === "settings"
                          ? "Settings"
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
                {/* Drag Overlay */}
                <DragOverlay dropAnimation={null}>
                  {activeDragId ? (
                    <div style={{
                      cursor: 'grabbing',
                      opacity: 1,
                      background: 'rgba(30, 41, 59, 0.9)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), 0 8px 32px rgba(0,0,0,0.5)',
                      transform: 'scale(1.02)',
                      backdropFilter: 'blur(8px)'
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
            {activeTab === "settings" && (
              <div className="glass-panel" style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                <Settings size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                <h3>Settings Coming Soon</h3>
                <p>Configure your SPTM experience here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </GoogleCalendarProvider>
  );
}

export default App;
