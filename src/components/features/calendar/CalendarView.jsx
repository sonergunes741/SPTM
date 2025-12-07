import React, { useState } from "react";
import { useTasks } from "../../../context/TaskContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TaskCard from "../tasks/TaskCard";
import GoogleCalendarSync from "./GoogleCalendarSync";

export default function CalendarView() {
  const { tasks } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getTasksForDate = (day) => {
    if (!day) return [];
    // Construct YYYY-MM-DD manually to match input[type="date"] format (which is just a string)
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

    return tasks.filter((t) => t.dueDate === dateStr);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ fontSize: "1.5rem" }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-ghost" onClick={handlePrevMonth}>
            <ChevronLeft />
          </button>
          <button className="btn btn-ghost" onClick={handleNextMonth}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <GoogleCalendarSync />

      <div
        className="glass-panel"
        style={{
          flex: 1,
          borderRadius: "var(--radius-lg)",
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "auto repeat(5, 1fr)", // Header + 5 weeks approx
          overflow: "hidden",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{
              padding: "1rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontWeight: 600,
            }}
          >
            {d}
          </div>
        ))}

        {days.map((day, idx) => (
          <div
            key={idx}
            style={{
              padding: "0.5rem",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              minHeight: "100px",
              position: "relative",
            }}
          >
            {day && (
              <>
                <span
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color:
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth()
                        ? "var(--color-primary)"
                        : "inherit",
                    fontWeight:
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth()
                        ? "bold"
                        : "normal",
                  }}
                >
                  {day}
                </span>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {getTasksForDate(day).map((task) => (
                    <div
                      key={task.id}
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.4rem",
                        background:
                          task.status === "done"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(99, 102, 241, 0.2)",
                        borderRadius: "3px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color:
                          task.status === "done"
                            ? "var(--color-text-muted)"
                            : "var(--color-text-main)",
                        textDecoration:
                          task.status === "done" ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
