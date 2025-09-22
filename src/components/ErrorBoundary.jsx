// src/components/ErrorBoundary.jsx
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                    color: "white",
                    padding: "2rem"
                }}>
                    <div style={{
                        textAlign: "center",
                        maxWidth: "500px",
                        padding: "2rem",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)"
                    }}>
                        <AlertTriangle size={64} style={{ marginBottom: "1rem" }} />
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                            Oops! Something went wrong
                        </h1>
                        <p style={{ marginBottom: "2rem", opacity: 0.9 }}>
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        <button
                            onClick={this.handleReload}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.75rem 1.5rem",
                                background: "rgba(255, 255, 255, 0.2)",
                                color: "white",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "600",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                                e.target.style.transform = "translateY(-2px)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                                e.target.style.transform = "translateY(0)";
                            }}
                        >
                            <RefreshCw size={20} />
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

