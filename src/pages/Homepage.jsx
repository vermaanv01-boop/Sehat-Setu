import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/SEHAT SETU LOGO.jpeg";

export default function Homepage() {
  const [showRoles, setShowRoles] = useState(false);
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 80px",
      background: dark
        ? "#000000"
        : "linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: "relative",
      flexWrap: "wrap",
      gap: "40px",
    }}>
      {/* Dark Mode Toggle (top right) */}
      <div style={{ position: "absolute", top: 20, right: 24, display: "flex", gap: "10px" }}>
        {user && (
          <div style={{ 
            display: "flex", alignItems: "center", gap: "12px", 
            background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)",
            padding: "4px 12px", borderRadius: "10px", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`
          }}>
            <span style={{ fontSize: "13px", color: dark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
              👤 {user.name}
            </span>
            <button 
              onClick={() => { logout(); navigate("/login"); }}
              style={{
                background: "transparent", border: "none", color: "#ef4444", 
                fontSize: "13px", fontWeight: 700, cursor: "pointer", padding: "4px 8px"
              }}
            >
              Sign Out
            </button>
          </div>
        )}
        <button
          onClick={toggle}
          title={dark ? "Light Mode" : "Dark Mode"}
          style={{
            background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)",
            border: dark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "18px",
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            color: dark ? "#fff" : "#334155",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* LEFT SIDE (INFO SECTION) */}
      <div style={{ color: dark ? "#fff" : "#1e293b", maxWidth: "480px", flex: 1 }}>
        <img src={logo} alt="SehatSetu-logo" style={{ width: "110px", borderRadius: "14px", marginBottom: "20px", boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.1)" }} />

        <h1 style={{
          fontSize: "42px", fontWeight: 800, color: dark ? "#fff" : "#0f172a",
          lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-1px",
        }}>
          Connecting Rural Health<br />with Urban Expertise
        </h1>

        <p style={{ fontSize: "16px", lineHeight: "1.7", color: dark ? "rgba(255,255,255,0.85)" : "#475569", maxWidth: "420px" }}>
          SehatSetu is a digital healthcare platform that bridges the gap between
          rural Primary Health Centres and urban hospitals — enabling remote diagnosis,
          reducing travel costs, and ensuring timely care even in low-connectivity areas.
        </p>

        <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
          {[
            { icon: "🏥", label: "PHC Network" },
            { icon: "🔬", label: "Remote Diagnosis" },
            { icon: "📡", label: "Low Bandwidth" },
          ].map(f => (
            <div key={f.label} style={{
              background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.04)",
              padding: "10px 16px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: dark ? "#fff" : "#334155",
              backdropFilter: "blur(4px)",
              border: dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.06)",
            }}>
              <span>{f.icon}</span> {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (CARD SECTION) */}
      <div style={{
        background: dark ? "rgba(18, 21, 42, 0.95)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(16px)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        textAlign: "center",
        minWidth: "300px",
        maxWidth: "340px",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}>
        {!showRoles ? (
          <>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>🏥</div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: dark ? "#e2e8f0" : "#1e293b", marginBottom: "8px" }}>
              Welcome to SehatSetu
            </h2>
            <p style={{ marginBottom: "28px", color: dark ? "#94a3b8" : "#64748b", fontSize: "14px" }}>
              Smart healthcare bridging rural & urban India
            </p>

            <button
              style={{
                width: "100%", padding: "14px",
                border: "none", borderRadius: "10px",
                background: "linear-gradient(135deg, #0f766e, #0891b2)",
                color: "#fff", fontWeight: 700, fontSize: "16px",
                cursor: "pointer", transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(15,118,110,0.4)",
              }}
              onClick={() => setShowRoles(true)}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Get Started →
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: dark ? "#e2e8f0" : "#1e293b", marginBottom: "6px" }}>
              Select Your Role
            </h2>
            <p style={{ fontSize: "13px", color: dark ? "#64748b" : "#94a3b8", marginBottom: "24px" }}>
              Choose how you're accessing SehatSetu
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                style={roleBtn("#3b82f6", "#1d4ed8")}
                onClick={() => navigate("/phc/dashboard")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                🏥 PHC — Primary Health Centre
              </button>

              <button
                style={roleBtn("#10b981", "#065f46")}
                onClick={() => navigate("/urban/dashboard")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                🏢 Urban Hospital
              </button>

              <button
                style={roleBtn("#6c5ce7", "#4c1d95")}
                onClick={() => navigate("/history")}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                🕓 View Full History
              </button>

              <button
                onClick={() => setShowRoles(false)}
                style={{
                  padding: "10px", border: "none", borderRadius: "10px",
                  background: dark ? "#1e2235" : "#f1f5f9",
                  color: dark ? "#94a3b8" : "#64748b",
                  cursor: "pointer", fontSize: "14px",
                  transition: "all 0.2s",
                }}
              >
                ← Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function roleBtn(from, to) {
  return {
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: `linear-gradient(135deg, ${from}, ${to})`,
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: `0 4px 14px ${from}44`,
  };
}