import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../Components/Navbar";
import StatsCards from "../Components/StatsCards";
import PieChart from "../Components/PieChart";
import LineChart from "../Components/LineChart";
import ReferralCard from "../Components/ReferralCard";
import UrgencyAlert from "../Components/UrgencyAlert";

export default function UrbanDashboard() {
  const { requests, updateRequest } = useData();
  const { dark } = useTheme();

  const [responses, setResponses] = useState({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertRequest, setAlertRequest] = useState(null);
  const [alertShownIds, setAlertShownIds] = useState(new Set());

  const bg = dark ? "#0d0f1a" : "#f1f0e6ff";
  const card = dark ? "#12152a" : "#ffffff";
  const border = dark ? "#1e2235" : "#e5e7eb";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#64748b" : "#94a3b8";
  const inputBg = dark ? "#1a1d2e" : "#f8fafc";
  const inputBorder = dark ? "#2e3150" : "#d1d5db";

  const pending = requests.filter(r => r.status === "Pending");
  const allRequests = requests;

  // Show alert for new critical/high pending cases not yet shown
  const newCritical = pending.find(r =>
    (r.urgency === "Critical" || r.urgency === "High") && !alertShownIds.has(r.id)
  );
  if (newCritical && !alertRequest) {
    setAlertRequest(newCritical);
    setAlertShownIds(prev => new Set([...prev, newCritical.id]));
  }

  const handleChange = (id, field, value) => {
    setResponses(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleResponse = (id) => {
    const res = responses[id] || {};
    updateRequest(id, {
      guidance: res.guidance || "",
      files: (res.files || []).map(f => ({ name: f.name, url: URL.createObjectURL(f) })),
      status: "Responded",
    });
    setResponses(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const filteredPending = pending.filter(r =>
    !search ||
    r.patient?.toLowerCase().includes(search.toLowerCase()) ||
    r.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
    r.suspected?.toLowerCase().includes(search.toLowerCase())
  );

  const Tab = ({ id, label, icon, badge }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        background: activeTab === id ? (dark ? "#1e3a6e" : "#dbeafe") : "transparent",
        color: activeTab === id ? (dark ? "#60a5fa" : "#1d4ed8") : muted,
        border: "none", borderRadius: "8px",
        padding: "8px 16px", fontWeight: activeTab === id ? 700 : 500,
        fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: "5px", position: "relative",
      }}
    >
      {icon} {label}
      {badge > 0 && (
        <span style={{
          background: "#ef4444", color: "#fff",
          fontSize: "10px", fontWeight: 700,
          padding: "1px 5px", borderRadius: "10px",
          marginLeft: "2px",
        }}>{badge}</span>
      )}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: text }}>
      <Navbar role="urban" />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: text }}>
            🏢 Urban Hospital Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", color: muted, fontSize: "14px" }}>
            Specialist Hospital — PHC Referral Response System
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "20px",
          background: dark ? "#12152a" : "#f1f5f9",
          padding: "4px", borderRadius: "10px",
          border: `1px solid ${border}`,
          width: "fit-content",
        }}>
          <Tab id="dashboard" label="Overview" icon="📊" />
          <Tab id="pending" label="Incoming" icon="📥" badge={pending.length} />
          <Tab id="all" label="All Cases" icon="📋" />
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <StatsCards requests={allRequests} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <PieChart requests={allRequests} />
              <LineChart requests={allRequests} />
            </div>
          </div>
        )}

        {/* PENDING TAB */}
        {activeTab === "pending" && (
          <div>
            {/* Search */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }}>🔍</span>
              <input
                placeholder="Search pending requests..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: muted }}>✕</button>
              )}
            </div>

            <p style={{ margin: "0 0 12px", fontSize: "13px", color: muted }}>
              {filteredPending.length} pending request(s)
            </p>

            {filteredPending.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: muted }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                <p>{search ? "No matches found." : "No pending requests. All clear!"}</p>
              </div>
            ) : (
              [...filteredPending]
                .sort((a, b) => {
                  const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                  return (order[a.urgency] ?? 4) - (order[b.urgency] ?? 4);
                })
                .map(r => (
                  <div key={r.id} style={{ marginBottom: "12px" }}>
                    <ReferralCard {...r} />
                    <div style={{
                      background: card, border: `1px solid ${border}`,
                      borderRadius: "0 0 12px 12px",
                      padding: "14px 16px",
                      marginTop: "-8px",
                      boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.06)",
                    }}>
                      <textarea
                        placeholder="Enter guidance / diagnosis / doctor notes..."
                        value={responses[r.id]?.guidance || ""}
                        onChange={e => handleChange(r.id, "guidance", e.target.value)}
                        rows={3}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                      />
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                        <input
                          type="file" multiple
                          onChange={e => handleChange(r.id, "files", Array.from(e.target.files))}
                          style={{ fontSize: "13px", color: text, flex: 1 }}
                        />
                        <button
                          onClick={() => handleResponse(r.id)}
                          style={{
                            background: "linear-gradient(135deg, #059669, #0891b2)",
                            color: "#fff", border: "none", borderRadius: "8px",
                            padding: "9px 20px", fontWeight: 700, fontSize: "13px",
                            cursor: "pointer", whiteSpace: "nowrap",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          ✅ Submit Response
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* ALL CASES TAB */}
        {activeTab === "all" && (
          <div>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }}>🔍</span>
              <input
                placeholder="Search all cases..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <p style={{ margin: "0 0 12px", fontSize: "13px", color: muted }}>
              Showing {allRequests.filter(r => !search || r.patient?.toLowerCase().includes(search.toLowerCase()) || r.symptoms?.toLowerCase().includes(search.toLowerCase())).length} of {allRequests.length} total cases
            </p>

            {[...allRequests]
              .filter(r => !search || r.patient?.toLowerCase().includes(search.toLowerCase()) || r.symptoms?.toLowerCase().includes(search.toLowerCase()))
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(r => <ReferralCard key={r.id} {...r} />)
            }
          </div>
        )}
      </div>

      {alertRequest && (
        <UrgencyAlert request={alertRequest} onClose={() => setAlertRequest(null)} />
      )}
    </div>
  );
}