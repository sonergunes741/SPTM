import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Chrome } from "lucide-react"; // Chrome icon for Google generic usage or standard img
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleCalendar } from "../../../hooks/useGoogleCalendar";

export default function LoginModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const { loginUser, handleLoginFailure } = useGoogleCalendar();

    // Google Login Hook
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);
                const userInfo = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    }
                ).then((res) => res.json());

                const user = {
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture,
                    credential: tokenResponse.access_token,
                };

                loginUser(user);
                onClose();
            } catch (error) {
                console.error("Google login error:", error);
                handleLoginFailure();
            } finally {
                setIsLoading(false);
            }
        },
        onError: handleLoginFailure,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // MOCK LOGIN / SIGNUP LOGIC
        // In a real app, this would verify credentials with a backend
        setTimeout(() => {
            const mockUser = {
                name: isSignUp ? formData.name : "Demo User",
                email: formData.email,
                picture: null, // Placeholder will be used
                credential: "mock-token",
            };

            loginUser(mockUser);
            setIsLoading(false);
            onClose();
        }, 1000); // Simulate network delay
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                animation: "fadeIn 0.2s ease",
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="glass-panel"
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "2.5rem",
                    margin: "1rem",
                    borderRadius: "var(--radius-xl)",
                    position: "relative",
                    animation: "slideUp 0.3s ease",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "1.25rem",
                        right: "1.25rem",
                        background: "transparent",
                        border: "none",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--color-text-muted)";
                    }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h2
                        className="text-gradient-primary"
                        style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
                    >
                        SPTM
                    </h2>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        {isSignUp ? "Create your account" : "Welcome!"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                    {isSignUp && (
                        <div style={{ position: "relative" }}>
                            <User
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "1rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "var(--color-text-muted)",
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "0.85rem 1rem 0.85rem 2.8rem",
                                    background: "rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "var(--radius-md)",
                                    color: "#fff",
                                    fontSize: "0.95rem",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                            />
                        </div>
                    )}

                    <div style={{ position: "relative" }}>
                        <Mail
                            size={18}
                            style={{
                                position: "absolute",
                                left: "1rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--color-text-muted)",
                            }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: "100%",
                                padding: "0.85rem 1rem 0.85rem 2.8rem",
                                background: "rgba(0, 0, 0, 0.2)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "var(--radius-md)",
                                color: "#fff",
                                fontSize: "0.95rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <Lock
                            size={18}
                            style={{
                                position: "absolute",
                                left: "1rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--color-text-muted)",
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                width: "100%",
                                padding: "0.85rem 1rem 0.85rem 2.8rem",
                                background: "rgba(0, 0, 0, 0.2)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "var(--radius-md)",
                                color: "#fff",
                                fontSize: "0.95rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                        />
                    </div>

                    {!isSignUp && (
                        <div style={{ textAlign: "right" }}>
                            <button
                                type="button"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--color-text-muted)",
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                                onMouseLeave={(e) => (e.target.style.color = "var(--color-text-muted)")}
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "0.85rem",
                            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                            border: "none",
                            borderRadius: "var(--radius-md)",
                            color: "#fff",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            cursor: isLoading ? "wait" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            transition: "opacity 0.2s",
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        margin: "1.5rem 0",
                        color: "var(--color-text-muted)",
                        fontSize: "0.8rem",
                    }}
                >
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                    <span>Or continue with</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                </div>

                {/* Google Login Button */}
                <button
                    onClick={() => googleLogin()}
                    type="button"
                    disabled={isLoading}
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "#fff",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        color: "#1e293b", // Slate 800
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        cursor: isLoading ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        transition: "transform 0.1s",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {/* Simple Google G icon SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>

                {/* Footer */}
                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--color-primary)",
                            fontWeight: 600,
                            cursor: "pointer",
                            marginLeft: "0.25rem",
                        }}
                    >
                        {isSignUp ? "Log In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
