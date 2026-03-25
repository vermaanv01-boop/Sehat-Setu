import React from "react";
import { useTheme } from "../context/ThemeContext";

const URGENCY_COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function LineChart({ requests }) {
  const { dark } = useTheme();
  const days = getLast7Days();

  const levels = ["Critical", "High", "Medium", "Low"];

  // Build data: for each day, count per urgency
  const data = days.map(day => {
    const entry = { day };
    levels.forEach(l => {
      entry[l] = requests.filter(r => r.timestamp && r.timestamp.startsWith(day) && r.urgency === l).length;
    });
    return entry;
  });

  const W = 320, H = 160, PL = 28, PB = 28, PR = 10, PT = 12;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;

  const maxVal = Math.max(1, ...data.flatMap(d => levels.map(l => d[l])));

  function toX(i) { return PL + (i / (days.length - 1)) * innerW; }
  function toY(v) { return PT + innerH - (v / maxVal) * innerH; }

  function buildPath(level) {
    return data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d[level])}`).join(" ");
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * maxVal));

  return (
    <div style={{
      background: dark ? "#1a1d2e" : "#fff",
      border: `1px solid ${dark ? "#2e3150" : "#e5e7eb"}`,
      borderRadius: "16px",
      padding: "20px",
      boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.06)",
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: "15px", color: dark ? "#e2e8f0" : "#1e293b", fontWeight: 600 }}>
        📈 Cases Over Time (Last 7 Days)
      </h3>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
        {/* Grid lines */}
        {gridLines.map((v, i) => (
          <g key={i}>
            <line
              x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)}
              stroke={dark ? "#2e3150" : "#f1f5f9"} strokeWidth="1"
            />
            <text x={PL - 4} y={toY(v)} textAnchor="end" dominantBaseline="middle"
              fontSize="9" fill={dark ? "#64748b" : "#94a3b8"}>{v}</text>
          </g>
        ))}

        {/* X axis labels */}
        {days.map((d, i) => (
          <text key={d} x={toX(i)} y={H - 4} textAnchor="middle"
            fontSize="9" fill={dark ? "#64748b" : "#94a3b8"}>
            {formatLabel(d)}
          </text>
        ))}

        {/* Lines */}
        {levels.map(level => (
          <g key={level}>
            <path d={buildPath(level)} fill="none"
              stroke={URGENCY_COLORS[level]} strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => d[level] > 0 && (
              <circle key={i} cx={toX(i)} cy={toY(d[level])} r="4"
                fill={URGENCY_COLORS[level]} stroke={dark ? "#1a1d2e" : "#fff"} strokeWidth="2">
                <title>{level}: {d[level]} on {d.day}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
        {levels.map(l => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: 20, height: 3, background: URGENCY_COLORS[l], borderRadius: 2, display: "inline-block" }} />
            <span style={{ fontSize: "11px", color: dark ? "#94a3b8" : "#64748b" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
