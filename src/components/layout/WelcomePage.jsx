import React, { useState } from "react";
import LoginModal from "../features/auth/LoginModal";
import { ArrowRight, CheckCircle2, Layout, ShieldCheck } from "lucide-react";

export default function WelcomePage() {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                background: "#0f172a",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Background Ambience */}
            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "-10%",
                    width: "50%",
                    height: "50%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(15,23,42,0) 70%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-10%",
                    right: "-10%",
                    width: "60%",
                    height: "60%",
                    background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(15,23,42,0) 70%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                }}
            />

            {/* Navigator / Header */}
            <header
                style={{
                    padding: "2rem 4rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 10,
                }}
            >
                <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.05em" }} className="text-gradient-primary">
                    SPTM
                </div>
                <button
                    onClick={() => setShowLoginModal(true)}
                    style={{
                        padding: "0.6rem 1.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "var(--radius-full)",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.borderColor = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }}
                >
                    Sign In
                </button>
            </header>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    zIndex: 10,
                    padding: "0 2rem",
                }}
                className="fade-in"
            >
                <div
                    style={{
                        marginBottom: "1.5rem",
                        padding: "0.5rem 1rem",
                        background: "rgba(99, 102, 241, 0.1)",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                        borderRadius: "var(--radius-full)",
                        color: "#818cf8",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <span style={{ width: "8px", height: "8px", background: "#818cf8", borderRadius: "50%" }} />
                    System v2.0 Live
                </div>

                <h1
                    style={{
                        fontSize: "5rem",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        marginBottom: "1.5rem",
                        background: "linear-gradient(135deg, #fff 0%, #94a3b8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        maxWidth: "900px",
                    }}
                >
                    Master your workflow. <br /> Not just your tasks.
                </h1>

                <p
                    style={{
                        fontSize: "1.25rem",
                        color: "var(--color-text-muted)",
                        maxWidth: "600px",
                        lineHeight: 1.6,
                        marginBottom: "3rem",
                    }}
                >
                    An elite personal management system designed for high performers.
                    Mission, Calendar, and Insights in one seamless interface.
                </p>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        style={{
                            padding: "1rem 2.5rem",
                            background: "#fff",
                            color: "#0f172a",
                            borderRadius: "var(--radius-full)",
                            border: "none",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            transition: "transform 0.2s",
                            boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.2)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        Get Started <ArrowRight size={20} />
                    </button>
                </div>

                {/* Feature Highlights Mockup */}
                <div style={{ marginTop: "5rem", display: "flex", gap: "3rem", opacity: 0.6 }}>
                    <FeatureItem icon={<CheckCircle2 />} text="GTD Workflow" />
                    <FeatureItem icon={<Layout />} text="Mission Control" />
                    <FeatureItem icon={<ShieldCheck />} text="Secure & Private" />
                </div>
            </main>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)" }}>
            {icon}
            <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
    )
}
