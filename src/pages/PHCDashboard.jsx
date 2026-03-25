import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";
import { detectDisease } from "../utils/diseaseDetector";
import Navbar from "../Components/Navbar";
import StatsCards from "../Components/StatsCards";
import PieChart from "../Components/PieChart";
import LineChart from "../Components/LineChart";
import ReferralCard from "../Components/ReferralCard";
import UrgencyAlert from "../Components/UrgencyAlert";

export default function PHCDashboard() {
  const { requests, addRequest } = useData();
  const { dark } = useTheme();
  const phcRequests = requests.filter(r => r.role === "phc" || !r.role);

  const [form, setForm] = useState({ patient: "", age: "", gender: "", symptoms: "", files: [] });
  const [previewRequest, setPreviewRequest] = useState(null);
  const [alertRequest, setAlertRequest] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | new | list

  const bg = dark ? "rgb(4, 23, 42)" : "#f1f0e6ff";
  const card = dark ? "#12152a" : "#ffffff";
  const border = dark ? "#1e2235" : "#e5e7eb";
  const text = dark ? "#e2e8f0" : "#2c3543ff";
  const muted = dark ? "#64748b" : "#94a3b8";
  const inputBg = dark ? "#1a1d2e" : "#f8fafc";
  const inputBorder = dark ? "#2e3150" : "#d1d5db";

  const handlePreview = () => {
    if (!form.patient || !form.symptoms) return alert("Patient name and symptoms are required!");
    const { disease, risk, advice } = detectDisease(form.symptoms);
    const newRequest = {
      id: Date.now(),
      role: "phc",
      patient: form.patient,
      age: form.age,
      gender: form.gender,
      symptoms: form.symptoms,
      suspected: disease,
      urgency: risk,
      advice,
      status: "Pending",
      files: form.files.map(f => ({ name: f.name, url: URL.createObjectURL(f), raw: f })),
      timestamp: new Date().toISOString(),
    };
    setPreviewRequest(newRequest);
  };

  const handleConfirmSubmit = () => {
    if (!previewRequest) return;
    addRequest(previewRequest);
    setForm({ patient: "", age: "", gender: "", symptoms: "", files: [] });

    if (previewRequest.urgency === "Critical" || previewRequest.urgency === "High") {
      setAlertRequest(previewRequest);
    }
    setPreviewRequest(null);
    setActiveTab("list");
  };

  const cancelPreview = () => setPreviewRequest(null);

  const filteredRequests = phcRequests.filter(r =>
    !search ||
    r.patient?.toLowerCase().includes(search.toLowerCase()) ||
    r.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
    r.suspected?.toLowerCase().includes(search.toLowerCase())
  );

  const Tab = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        background: activeTab === id ? (dark ? "#1e3a6e" : "#dbeafe") : "transparent",
        color: activeTab === id ? (dark ? "#60a5fa" : "#1d4ed8") : muted,
        border: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        fontWeight: activeTab === id ? 700 : 500,
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: text, margin: 0 }}>
      <Navbar role="phc" />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: text }}>
            🏥 Primary Health Centres (PHCs)
          </h1>
          <p style={{ margin: "4px 0 0", color: muted, fontSize: "18px" }}>
            Primary Health Centre — Patient Referral System
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
          <Tab id="new" label="New Patient" icon="➕" />
          <Tab id="list" label="All Cases" icon="📋" />
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <StatsCards requests={phcRequests} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <PieChart requests={phcRequests} />
              <LineChart requests={phcRequests} />
            </div>
          </div>
        )}

        {/* NEW PATIENT TAB */}
        {activeTab === "new" && (
          <div style={{
            background: card,
            border: `1px solid ${border}`,
            borderRadius: "16px",
            padding: "24px",
            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "17px", color: text }}>📝 New Patient Referral</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              {[
                { key: "patient", placeholder: "Patient Name / नाम *", type: "text" },
                { key: "age", placeholder: "Age / उम्र", type: "number" },
                { key: "gender", placeholder: "Gender / लिंग (M/F/Other)", type: "text" },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key}
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ padding: "10px 14px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none" }}
                />
              ))}
            </div>

            <textarea
              placeholder="Describe Symptoms / लक्षण बताएं (English / Hindi / Hinglish) *"
              value={form.symptoms}
              onChange={e => setForm({ ...form, symptoms: e.target.value })}
              rows={4}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: "12px" }}
            />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px" }}>📎 Upload Files (X-rays, Reports, etc.)</label>
              <input
                type="file"
                multiple
                onChange={e => setForm({ ...form, files: Array.from(e.target.files) })}
                style={{ fontSize: "13px", color: text }}
              />
              {form.files.length > 0 && (
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: muted }}>
                  {form.files.length} file(s) selected: {form.files.map(f => f.name).join(", ")}
                </p>
              )}
            </div>

            {!previewRequest ? (
              <button
                onClick={handlePreview}
                style={{
                  background: "linear-gradient(135deg, #0f766e, #0891b2)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "12px 28px", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.3)"
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Preview Referral 👁️
              </button>
            ) : (
              <div style={{
                background: dark ? "#1e293b" : "#f8fafc",
                border: `1px solid ${border}`, borderRadius: "12px",
                padding: "20px", marginTop: "20px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
              }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: text, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#3b82f6" }}>ℹ️</span> Review Referral Details
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px", marginBottom: "20px", color: text }}>
                  <div><strong style={{ color: muted }}>Patient:</strong> {previewRequest.patient}</div>
                  <div><strong style={{ color: muted }}>Age/Gender:</strong> {previewRequest.age || "N/A"} / {previewRequest.gender || "N/A"}</div>
                  <div style={{ gridColumn: "span 2" }}><strong style={{ color: muted }}>Symptoms:</strong> {previewRequest.symptoms}</div>
                  <div style={{ gridColumn: "span 2", padding: "12px", background: dark ? "#111827" : "#fff", borderRadius: "8px", border: `1px solid ${border}` }}>
                    <div style={{ marginBottom: "6px" }}><strong style={{ color: muted }}>Detected Condition:</strong> <span style={{ fontWeight: 600 }}>{previewRequest.suspected}</span></div>
                    <div style={{ marginBottom: "6px" }}><strong style={{ color: muted }}>Urgency Level:</strong> <span style={{
                      fontWeight: 700,
                      color: previewRequest.urgency === "Critical" ? "#ef4444" :
                        previewRequest.urgency === "High" ? "#f97316" :
                          previewRequest.urgency === "Medium" ? "#eab308" : "#22c55e"
                    }}>{previewRequest.urgency}</span></div>
                    <div><strong style={{ color: muted }}>Advice:</strong> {previewRequest.advice}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={handleConfirmSubmit}
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)", color: "#fff",
                      border: "none", borderRadius: "10px", padding: "12px 28px",
                      fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Confirm & Send to Urban →
                  </button>
                  <button
                    onClick={cancelPreview}
                    style={{
                      background: "transparent", color: muted,
                      border: `1px solid ${border}`, borderRadius: "10px", padding: "12px 28px",
                      fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = dark ? "#334155" : "#e2e8f0"; e.currentTarget.style.color = text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = muted; }}
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIST TAB */}
        {activeTab === "list" && (
          <div>
            {/* Search */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }}>🔍</span>
              <input
                placeholder="Search by patient name, symptoms, or disease..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px 11px 36px",
                  borderRadius: "10px", border: `1px solid ${inputBorder}`,
                  background: inputBg, color: text, fontSize: "14px",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: muted }}
                >✕</button>
              )}
            </div>

            <p style={{ margin: "0 0 12px", fontSize: "13px", color: muted }}>
              Showing {filteredRequests.length} of {phcRequests.length} cases
            </p>

            {filteredRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: muted }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                <p>{search ? "No cases match your search." : "No cases submitted yet."}</p>
              </div>
            ) : (
              [...filteredRequests]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(r => <ReferralCard key={r.id} {...r} />)
            )}
          </div>
        )}
      </div>

      {/* Urgency Alert */}
      {alertRequest && (
        <UrgencyAlert request={alertRequest} onClose={() => setAlertRequest(null)} />
      )}
    </div>
  );
}