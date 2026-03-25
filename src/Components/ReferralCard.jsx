import React from "react";
import Badge from "./Badge";
import TimeAgo from "./TimeAgo";
import { useTheme } from "../context/ThemeContext";

const URGENCY_BORDER = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

export default function ReferralCard({
  id,
  patient,
  age,
  gender,
  symptoms,
  suspected,
  urgency,
  status,
  timestamp,
  files = [],
  guidance = "",
  advice = "",
  role,
}) {
  const { dark } = useTheme();
  const border = URGENCY_BORDER[urgency] || "#e2e8f0";

  return (
    <div
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = dark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = dark ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.04)"; }}
      style={{
      border: `1.5px solid ${dark ? "#2e3150" : "#e2e8f0"}`,
      borderLeft: `4px solid ${border}`,
      padding: "16px",
      marginBottom: "12px",
      borderRadius: "14px",
      backgroundColor: dark ? "#1a1d2e" : "#ffffff",
      boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.04)",
      transition: "all 0.25s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: "15px", color: dark ? "#e2e8f0" : "#1e293b" }}>
            👤 {patient}
          </span>
          {age && <span style={{ marginLeft: 8, fontSize: "13px", color: dark ? "#94a3b8" : "#64748b" }}>
            {age} yrs • {gender || "N/A"}
          </span>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Badge label={urgency} type="urgency" />
          <Badge label={status} type="status" />
          {role && (
            <span style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "12px",
              background: role === "phc" ? "#dbeafe" : "#d1fae5",
              color: role === "phc" ? "#1e40af" : "#065f46",
              letterSpacing: "0.5px",
            }}>
              {role.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: "13px", color: dark ? "#94a3b8" : "#475569" }}>
        <p style={{ margin: "0 0 4px" }}><strong style={{ color: dark ? "#cbd5e1" : "#374151" }}>Symptoms:</strong> {symptoms}</p>
        {suspected && <p style={{ margin: "0 0 4px" }}><strong style={{ color: dark ? "#cbd5e1" : "#374151" }}>Suspected:</strong> {suspected}</p>}
        {advice && <p style={{ margin: "0 0 4px", color: dark ? "#fbbf24" : "#92400e" }}>💡 {advice}</p>}
      </div>

      {guidance && (
        <div style={{
          marginTop: 10, padding: "10px 14px",
          background: dark ? "#0d2b1a" : "#f0fdf4",
          border: `1px solid ${dark ? "#166534" : "#bbf7d0"}`,
          borderRadius: "8px",
          fontSize: "13px",
          color: dark ? "#86efac" : "#166534",
        }}>
          🏥 <strong>Doctor Guidance:</strong> {guidance}
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <strong style={{ fontSize: "12px", color: dark ? "#94a3b8" : "#64748b" }}>📎 Files ({files.length}):</strong>
          <ul style={{ margin: "4px 0 0", padding: "0 0 0 16px" }}>
            {files.map((f, i) => (
              <li key={i} style={{ fontSize: "12px", color: dark ? "#60a5fa" : "#3b82f6" }}>
                <a href={f.url || "#"} target="_blank" rel="noopener noreferrer"
                  style={{ color: "inherit" }}>{typeof f === "string" ? f : f.name || `File ${i + 1}`}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <TimeAgo ts={timestamp} />
      </div>
    </div>
  );
}