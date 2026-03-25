import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const URGENCY_ICONS = {
  Critical: "🚨",
  High: "⚠️",
};

const URGENCY_COLORS = {
  Critical: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b", dark_bg: "#2d0d0d", dark_text: "#fca5a5" },
  High: { bg: "#fff7ed", border: "#f97316", text: "#9a3412", dark_bg: "#2d1a0d", dark_text: "#fdba74" },
};

export default function UrgencyAlert({ request, onClose }) {
  const { dark } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  if (!request) return null;
  const urgency = request.urgency;
  if (urgency !== "Critical" && urgency !== "High") return null;

  const colors = URGENCY_COLORS[urgency];

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      zIndex: 1000, display: "flex",
      alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.25s ease",
    }}>
      <div style={{
        background: dark ? colors.dark_bg : colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "32px",
        maxWidth: "440px",
        width: "90%",
        boxShadow: `0 20px 60px ${colors.border}44`,
        transform: visible ? "scale(1)" : "scale(0.8)",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        textAlign: "center",
      }}>
        {/* Pulsing icon */}
        <div style={{
          fontSize: "52px",
          marginBottom: "12px",
          animation: "pulse 1s infinite",
        }}>
          {URGENCY_ICONS[urgency]}
        </div>

        <div style={{
          display: "inline-block",
          background: colors.border,
          color: "#fff",
          fontSize: "11px",
          fontWeight: 700,
          padding: "4px 14px",
          borderRadius: "20px",
          letterSpacing: "1.5px",
          marginBottom: "14px",
        }}>
          {urgency.toUpperCase()} URGENCY
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: "20px", color: dark ? colors.dark_text : colors.text }}>
          New {urgency} Case Submitted!
        </h2>
        <p style={{ margin: "0 0 6px", color: dark ? "#e2e8f0" : "#374151", fontWeight: 600 }}>
          Patient: <strong>{request.patient}</strong>
        </p>
        {request.age && (
          <p style={{ margin: "0 0 4px", color: dark ? "#94a3b8" : "#6b7280", fontSize: "13px" }}>
            Age: {request.age} | Gender: {request.gender || "N/A"}
          </p>
        )}
        <p style={{ margin: "8px 0 6px", color: dark ? "#94a3b8" : "#6b7280", fontSize: "13px" }}>
          <strong>Symptoms:</strong> {request.symptoms}
        </p>
        {request.suspected && (
          <p style={{ margin: "0 0 16px", color: dark ? "#94a3b8" : "#6b7280", fontSize: "13px" }}>
            <strong>Suspected:</strong> {request.suspected}
          </p>
        )}

        <div style={{
          background: dark ? "#1e1b1b" : "#fff",
          border: `1px solid ${colors.border}44`,
          borderRadius: "10px",
          padding: "10px 14px",
          marginBottom: "20px",
          fontSize: "13px",
          color: dark ? "#e2e8f0" : "#374151",
          textAlign: "left",
        }}>
          💡 <strong>Advice:</strong> {request.advice || "Immediate medical attention required."}
        </div>

        <button
          onClick={handleClose}
          style={{
            background: colors.border,
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 28px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Acknowledge & Continue
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }`}</style>
    </div>
  );
}
