import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../Components/Navbar";
import ReferralCard from "../Components/ReferralCard";

export default function History() {
  const { requests } = useData();
  const { dark } = useTheme();
  const [search, setSearch] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const bg = dark ? "#0d0f1a" : "#f4f7fb";
  const border = dark ? "#1e2235" : "#e5e7eb";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#64748b" : "#94a3b8";
  const inputBg = dark ? "#1a1d2e" : "#f8fafc";
  const inputBorder = dark ? "#2e3150" : "#d1d5db";
  const chipActive = dark ? "#1e3a6e" : "#dbeafe";
  const chipActiveTxt = dark ? "#60a5fa" : "#1d4ed8";

  const urgencyLevels = ["All", "Critical", "High", "Medium", "Low"];
  const roles = ["All", "phc", "urban"];
  const statuses = ["All", "Pending", "Responded"];

  const filtered = [...requests]
    .filter(r =>
      (filterUrgency === "All" || r.urgency === filterUrgency) &&
      (filterRole === "All" || r.role === filterRole) &&
      (filterStatus === "All" || r.status === filterStatus) &&
      (!search ||
        r.patient?.toLowerCase().includes(search.toLowerCase()) ||
        r.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
        r.suspected?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const Chip = ({ label, active, onClick, color }) => (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px", borderRadius: "20px",
        border: `1px solid ${active ? chipActiveTxt : (dark ? "#2e3150" : "#d1d5db")}`,
        background: active ? chipActive : "transparent",
        color: active ? chipActiveTxt : muted,
        fontSize: "12px", fontWeight: active ? 700 : 500,
        cursor: "pointer", transition: "all 0.15s",
      }}
    >{label}</button>
  );

  const summaryStats = {
    total: requests.length,
    byUrgency: {
      Critical: requests.filter(r => r.urgency === "Critical").length,
      High: requests.filter(r => r.urgency === "High").length,
      Medium: requests.filter(r => r.urgency === "Medium").length,
      Low: requests.filter(r => r.urgency === "Low").length,
    },
    phc: requests.filter(r => r.role === "phc").length,
    urban: requests.filter(r => r.role === "urban").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: text }}>
      <Navbar role={null} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: text }}>
            🕓 Patient History
          </h1>
          <p style={{ margin: "4px 0 0", color: muted, fontSize: "14px" }}>
            Unified history from both PHC and Urban hospital — all diseases, symptoms, and uploaded files
          </p>
        </div>

        {/* Quick Stats Row */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          {[
            { label: "Total", value: summaryStats.total, color: "#6c5ce7" },
            { label: "Critical", value: summaryStats.byUrgency.Critical, color: "#ef4444" },
            { label: "High", value: summaryStats.byUrgency.High, color: "#f97316" },
            { label: "Medium", value: summaryStats.byUrgency.Medium, color: "#eab308" },
            { label: "Low", value: summaryStats.byUrgency.Low, color: "#22c55e" },
            { label: "PHC", value: summaryStats.phc, color: "#3b82f6" },
            { label: "Urban", value: summaryStats.urban, color: "#10b981" },
          ].map(s => (
            <div key={s.label} style={{
              padding: "8px 14px", borderRadius: "10px",
              background: `${s.color}18`,
              border: `1px solid ${s.color}44`,
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ fontWeight: 800, color: s.color, fontSize: "16px" }}>{s.value}</span>
              <span style={{ fontSize: "12px", color: dark ? "#94a3b8" : "#64748b" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }}>🔍</span>
          <input
            placeholder="Search patient name, symptoms, disease..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: muted }}>✕</button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: muted, fontWeight: 600 }}>URGENCY:</span>
          {urgencyLevels.map(u => (
            <Chip key={u} label={u} active={filterUrgency === u} onClick={() => setFilterUrgency(u)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: muted, fontWeight: 600 }}>SOURCE:</span>
          {roles.map(r => (
            <Chip key={r} label={r === "All" ? "All" : r.toUpperCase()} active={filterRole === r} onClick={() => setFilterRole(r)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: muted, fontWeight: 600 }}>STATUS:</span>
          {statuses.map(s => (
            <Chip key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
          ))}
        </div>

        {/* Result count */}
        <p style={{ margin: "0 0 12px", fontSize: "13px", color: muted }}>
          Showing {filtered.length} record(s)
        </p>

        {/* History List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: muted }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>🗂️</div>
            <p>{search || filterUrgency !== "All" || filterRole !== "All" ? "No records match your filters." : "No patient history yet."}</p>
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} style={{ marginBottom: "10px" }}>
              <ReferralCard {...r} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}