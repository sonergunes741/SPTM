import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleCalendar } from "../../../hooks/useGoogleCalendar";
import { LogOut } from "lucide-react";

export default function GoogleCalendarLogin() {
  const {
    isAuthenticated,
    googleUser,
    handleLoginSuccess,
    handleLoginFailure,
    logout,
    error,
  } = useGoogleCalendar();

  if (isAuthenticated && googleUser) {
    return (
      <div style={styles.container}>
        <div style={styles.userInfo}>
          <div style={styles.greeting}>{googleUser.name || "User"}</div>
          <p style={styles.email}>{googleUser.email}</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={14} />
          Disconnect
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Google Calendar</h4>
      <p style={styles.description}>Connect to sync tasks</p>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        text="signin_with"
        size="small"
        width="100%"
      />
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    backgroundColor: "rgba(var(--color-primary-rgb, 99, 102, 241), 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    border: "1px solid rgba(var(--color-primary-rgb, 99, 102, 241), 0.2)",
    fontSize: "0.85rem",
  },
  title: {
    margin: "0 0 0.3rem 0",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  description: {
    margin: "0 0 0.8rem 0",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.75rem",
  },
  userInfo: {
    marginBottom: "0.8rem",
  },
  greeting: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: "0.2rem",
    fontSize: "0.9rem",
  },
  email: {
    color: "rgba(255, 255, 255, 0.6)",
    margin: 0,
    fontSize: "0.75rem",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    width: "100%",
    padding: "0.5rem 0.8rem",
    backgroundColor: "rgba(var(--color-danger-rgb, 239, 68, 68), 0.2)",
    color: "#fff",
    border: "1px solid rgba(var(--color-danger-rgb, 239, 68, 68), 0.3)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.75rem",
    transition: "all 0.3s ease",
    fontWeight: "500",
  },
  error: {
    color: "#ff6b6b",
    marginTop: "0.5rem",
    fontSize: "0.7rem",
  },
};
