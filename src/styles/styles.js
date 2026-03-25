export const S = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
    display: "block",
    marginBottom: "4px",
  },
  btn: (color = "#0f766e") => ({
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  }),
  btnGhost: {
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#374151",
  },
};

export const URGENCY_STYLE = {
  Critical: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  High:     { bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  Medium:   { bg: "#fefce8", text: "#854d0e", dot: "#eab308" },
  Low:      { bg: "#f0fdf4", text: "#14532d", dot: "#22c55e" },
  // Legacy uppercase keys
  RED:      { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  HIGH:     { bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  MEDIUM:   { bg: "#fefce8", text: "#854d0e", dot: "#eab308" },
  YELLOW:   { bg: "#fefce8", text: "#854d0e", dot: "#eab308" },
  LOW:      { bg: "#f0fdf4", text: "#14532d", dot: "#22c55e" },
  GREEN:    { bg: "#f0fdf4", text: "#14532d", dot: "#22c55e" },
  UNKNOWN:  { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
};

export const STATUS_STYLE = {
  Pending:    { bg: "#f1f5f9", text: "#475569" },
  Accepted:   { bg: "#dcfce7", text: "#166534" },
  Responded:  { bg: "#dbeafe", text: "#1e40af" },
  "In Transit": { bg: "#dbeafe", text: "#1e40af" },
  Declined:   { bg: "#fee2e2", text: "#991b1b" },
  Completed:  { bg: "#f0fdf4", text: "#166534" },
};