import React from "react";
import { useTheme } from "../context/ThemeContext";

const URGENCY_COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
  Unknown: "#6b7280",
};

function getPieSlices(requests) {
  const levels = ["Critical", "High", "Medium", "Low"];
  const total = requests.length;
  if (total === 0) return [];

  let startAngle = -Math.PI / 2;
  return levels.map(level => {
    const count = requests.filter(r => r.urgency === level).length;
    const pct = count / total;
    const angle = pct * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = Math.cos(startAngle) * 80;
    const y1 = Math.sin(startAngle) * 80;
    const x2 = Math.cos(endAngle) * 80;
    const y2 = Math.sin(endAngle) * 80;
    const largeArc = angle > Math.PI ? 1 : 0;

    const pathData = pct === 1
      ? `M 0 -80 A 80 80 0 1 1 0 80 A 80 80 0 1 1 0 -80 Z`
      : `M 0 0 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const midAngle = startAngle + angle / 2;
    const labelX = Math.cos(midAngle) * 52;
    const labelY = Math.sin(midAngle) * 52;

    startAngle = endAngle;
    return { level, count, pct, pathData, labelX, labelY, color: URGENCY_COLORS[level] };
  }).filter(s => s.count > 0);
}

export default function PieChart({ requests }) {
  const { dark } = useTheme();
  const slices = getPieSlices(requests);
  const total = requests.length;

  return (
    <div style={{
      background: dark ? "#1a1d2e" : "#fff",
      border: `1px solid ${dark ? "#2e3150" : "#e5e7eb"}`,
      borderRadius: "16px",
      padding: "20px",
      boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.06)",
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: "15px", color: dark ? "#e2e8f0" : "#1e293b", fontWeight: 600 }}>
        📊 Cases by Urgency
      </h3>
      {total === 0 ? (
        <p style={{ textAlign: "center", color: dark ? "#64748b" : "#94a3b8", padding: "40px 0" }}>No data yet</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <svg viewBox="-100 -100 200 200" width="180" height="180" style={{ flexShrink: 0 }}>
            {slices.map(s => (
              <g key={s.level}>
                <path d={s.pathData} fill={s.color} stroke={dark ? "#1a1d2e" : "#fff"} strokeWidth="2">
                  <title>{s.level}: {s.count} ({(s.pct * 100).toFixed(1)}%)</title>
                </path>
                {s.pct > 0.06 && (
                  <text
                    x={s.labelX} y={s.labelY}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fill="#fff" fontWeight="700"
                    style={{ pointerEvents: "none" }}
                  >
                    {Math.round(s.pct * 100)}%
                  </text>
                )}
              </g>
            ))}
          </svg>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            {slices.map(s => (
              <div key={s.level} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: dark ? "#cbd5e1" : "#475569", flex: 1 }}>{s.level}</span>
                <span style={{
                  fontWeight: 700, fontSize: "13px",
                  color: s.color,
                  background: `${s.color}22`,
                  padding: "2px 8px",
                  borderRadius: "20px"
                }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
