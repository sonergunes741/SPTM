import React, { useState } from "react";
import { useGoogleCalendar } from "../../../hooks/useGoogleCalendar";
import { useTasks } from "../../../context/TaskContext";
import { Calendar, AlertCircle, CheckCircle } from "lucide-react";

export default function GoogleCalendarSync() {
  const {
    isAuthenticated,
    isLoading,
    error,
    createCalendarEvent,
    fetchCalendarEvents,
  } = useGoogleCalendar();
  const { tasks } = useTasks();
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncedCount, setSyncedCount] = useState(0);

  const handleSyncTasksToCalendar = async () => {
    if (!isAuthenticated) {
      setSyncStatus("error");
      return;
    }

    setSyncStatus("syncing");
    setSyncedCount(0);
    let synced = 0;

    try {
      for (const task of tasks) {
        if (task.dueDate && task.dueDate !== "") {
          const calendarEvent = {
            title: task.title,
            description: task.description || `Priority: ${task.priority}`,
            startTime: new Date(task.dueDate).toISOString(),
            endTime: new Date(
              new Date(task.dueDate).getTime() + 60 * 60 * 1000
            ).toISOString(),
            missionId: task.missionId,
            taskId: task.id,
            context: task.context,
          };

          const result = await createCalendarEvent(calendarEvent);
          if (result) {
            synced++;
          }
        }
      }

      setSyncedCount(synced);
      setSyncStatus("success");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      console.error("Sync error:", err);
      setSyncStatus("error");
    }
  };

  const handleFetchCalendarEvents = async () => {
    if (!isAuthenticated) {
      setSyncStatus("error");
      return;
    }

    setSyncStatus("syncing");
    try {
      const events = await fetchCalendarEvents();
      setSyncedCount(events.length);
      setSyncStatus("success");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      console.error("Fetch error:", err);
      setSyncStatus("error");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Calendar size={18} style={styles.icon} />
        <h3 style={styles.title}>Calendar Sync</h3>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={handleSyncTasksToCalendar}
          disabled={isLoading}
          style={{
            ...styles.button,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Syncing..." : "Sync Tasks to Calendar"}
        </button>
        <button
          onClick={handleFetchCalendarEvents}
          disabled={isLoading}
          style={{
            ...styles.button,
            backgroundColor: "rgba(100, 200, 255, 0.2)",
            borderColor: "rgba(100, 200, 255, 0.5)",
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Fetching..." : "Fetch Calendar Events"}
        </button>
      </div>

      {syncStatus === "success" && (
        <div style={styles.successMessage}>
          <CheckCircle size={16} style={styles.messageIcon} />
          <span>{syncedCount} item(s) synced successfully</span>
        </div>
      )}

      {syncStatus === "error" && (
        <div style={styles.errorMessage}>
          <AlertCircle size={16} style={styles.messageIcon} />
          <span>{error || "Sync failed"}</span>
        </div>
      )}

      <p style={styles.info}>
        Sync your tasks with Google Calendar to keep everything organized.
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    backgroundColor: "rgba(var(--color-primary-rgb, 99, 102, 241), 0.08)",
    borderRadius: "8px",
    border: "1px solid rgba(var(--color-primary-rgb, 99, 102, 241), 0.15)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },
  icon: {
    color: "var(--color-primary, #6366f1)",
  },
  title: {
    margin: 0,
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    flexWrap: "wrap",
  },
  button: {
    padding: "0.5rem 0.8rem",
    backgroundColor: "rgba(var(--color-primary-rgb, 99, 102, 241), 0.15)",
    color: "#fff",
    border: "1px solid rgba(var(--color-primary-rgb, 99, 102, 241), 0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.3s ease",
    flex: 1,
    minWidth: "140px",
    fontWeight: "500",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    color: "#81c784",
    borderRadius: "6px",
    marginBottom: "0.5rem",
    fontSize: "0.85rem",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem",
    backgroundColor: "rgba(244, 67, 54, 0.15)",
    color: "#ef5350",
    borderRadius: "6px",
    marginBottom: "0.5rem",
    fontSize: "0.85rem",
  },
  messageIcon: {
    flexShrink: 0,
  },
  info: {
    margin: "0.5rem 0 0 0",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.75rem",
    lineHeight: "1.3",
  },
};
