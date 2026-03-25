import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function StatsCards({ requests }) {
  const { dark } = useTheme();

  const stats = [
    {
      label: "Total Cases",
      value: requests.length,
      icon: "🗂️",
      color: "#6c5ce7",
      bg: dark ? "#1e1b3a" : "#f0eeff",
    },
    {
      label: "Pending",
      value: requests.filter(r => r.status === "Pending").length,
      icon: "⏳",
      color: "#e67e22",
      bg: dark ? "#2d1f0e" : "#fff7ed",
    },
    {
      label: "Responded",
      value: requests.filter(r => r.status === "Responded").length,
      icon: "✅",
      color: "#27ae60",
      bg: dark ? "#0d2b1a" : "#f0fdf4",
    },
    {
      label: "Critical",
      value: requests.filter(r => r.urgency === "Critical").length,
      icon: "🚨",
      color: "#e74c3c",
      bg: dark ? "#2d0d0d" : "#fef2f2",
    },
    {
      label: "High Risk",
      value: requests.filter(r => r.urgency === "High").length,
      icon: "⚠️",
      color: "#e67e22",
      bg: dark ? "#2d1a0d" : "#fff7ed",
    },
    {
      label: "Low Risk",
      value: requests.filter(r => r.urgency === "Low").length,
      icon: "💚",
      color: "#27ae60",
      bg: dark ? "#0d2b1a" : "#f0fdf4",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: "14px",
      marginBottom: "24px",
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: s.bg,
          border: `2px solid ${s.color}33`,
          borderRadius: "14px",
          padding: "18px 14px",
          textAlign: "center",
          boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.06)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "default",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = dark ? `0 8px 24px rgba(0,0,0,0.5)` : `0 8px 24px ${s.color}22`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = dark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.06)";
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: s.color, lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: "12px", marginTop: "6px", color: dark ? "#aaa" : "#666", fontWeight: "500" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
