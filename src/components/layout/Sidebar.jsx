import { useState } from "react";
import {
    LayoutDashboard,
    Target,
    Calendar,
    PieChart,
    Archive,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    LogIn,
    User,
} from "lucide-react";
import { useGoogleCalendar } from "../../hooks/useGoogleCalendar";
import LoginModal from "../features/auth/LoginModal";

export default function Sidebar({ activeTab, setActiveTab }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const {
        isAuthenticated,
        googleUser,
        logout,
    } = useGoogleCalendar();

    return (
        <>
            <aside
                className="glass-panel"
                style={{
                    width: isCollapsed ? "80px" : "280px",
                    padding: isCollapsed ? "2rem 1rem" : "2rem",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 10,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                }}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        position: "absolute",
                        top: "1.5rem",
                        right: isCollapsed ? "50%" : "1rem",
                        transform: isCollapsed ? "translateX(50%)" : "none",
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
                        zIndex: 20,
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
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Logo */}
                <div
                    style={{
                        marginBottom: "3rem",
                        cursor: "pointer",
                        textAlign: isCollapsed ? "center" : "left",
                        marginTop: isCollapsed ? "2rem" : "0",
                    }}
                    onClick={() => setActiveTab("dashboard")}
                >
                    <h1
                        className="text-gradient-primary"
                        style={{
                            fontSize: isCollapsed ? "1.5rem" : "2rem",
                            letterSpacing: "-0.03em",
                            marginBottom: "0.25rem",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {isCollapsed ? "S" : "SPTM"}
                    </h1>
                    {!isCollapsed && (
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
                                display: "block"
                            }}
                        >
                            Smart Personal Task Manager
                        </p>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <NavButton
                        active={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        collapsed={isCollapsed}
                    />
                    <NavButton
                        active={activeTab === "mission"}
                        onClick={() => setActiveTab("mission")}
                        icon={<Target size={20} />}
                        label="Mission"
                        collapsed={isCollapsed}
                    />
                    <NavButton
                        active={activeTab === "calendar"}
                        onClick={() => setActiveTab("calendar")}
                        icon={<Calendar size={20} />}
                        label="Calendar"
                        collapsed={isCollapsed}
                    />
                    <NavButton
                        active={activeTab === "stats"}
                        onClick={() => setActiveTab("stats")}
                        icon={<PieChart size={20} />}
                        label="Insights"
                        collapsed={isCollapsed}
                    />
                    <NavButton
                        active={activeTab === "archive"}
                        onClick={() => setActiveTab("archive")}
                        icon={<Archive size={20} />}
                        label="Archive"
                        collapsed={isCollapsed}
                    />

                    <div style={{ flex: 1 }} /> {/* Spacer */}

                    {/* Settings Button - Only visible if authenticated */}
                    {isAuthenticated && (
                        <NavButton
                            active={activeTab === "settings"}
                            onClick={() => setActiveTab("settings")}
                            icon={<Settings size={20} />}
                            label="Settings"
                            collapsed={isCollapsed}
                        />
                    )}
                </nav>

                {/* Footer / User Profile */}
                <div
                    style={{
                        marginTop: "1rem",
                        paddingTop: "1.5rem",
                        borderTop: isCollapsed ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: isCollapsed ? "center" : "stretch",
                        minHeight: "40px"
                    }}
                >
                    {isAuthenticated ? (
                        <div style={{
                            display: "flex",
                            flexDirection: isCollapsed ? "column" : "row",
                            alignItems: "center",
                            gap: isCollapsed ? "0.5rem" : "1rem"
                        }}>
                            <img
                                src={googleUser?.picture}
                                alt="User"
                                style={{
                                    width: isCollapsed ? "32px" : "36px",
                                    height: isCollapsed ? "32px" : "36px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255,255,255,0.1)"
                                }}
                            />

                            {!isCollapsed && (
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {googleUser?.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--color-text-muted)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.25rem",
                                            marginTop: "0.2rem",
                                            transition: "color 0.2s"
                                        }}
                                        onClick={logout}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-danger)"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                                    >
                                        <LogOut size={12} /> Log out
                                    </div>
                                </div>
                            )}
                            {/* If collapsed, show logout button */}
                            {isCollapsed && (
                                <button
                                    onClick={logout}
                                    title="Log out"
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--color-text-muted)",
                                        cursor: "pointer",
                                        padding: "4px"
                                    }}
                                >
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <button
                                onClick={() => setShowLoginModal(true)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: isCollapsed ? "0" : "0.75rem",
                                    width: isCollapsed ? "40px" : "100%",
                                    height: isCollapsed ? "40px" : "auto",
                                    padding: isCollapsed ? "0" : "0.75rem 1rem",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: isCollapsed ? "50%" : "var(--radius-md)",
                                    color: "var(--color-text-main)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    fontSize: "0.9rem",
                                    fontWeight: 600
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                    e.currentTarget.style.borderColor = "var(--color-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                }}
                            >
                                <LogIn size={18} />
                                {!isCollapsed && "Log In"}
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
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
