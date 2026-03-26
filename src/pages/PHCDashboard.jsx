import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { detectDisease } from "../utils/diseaseDetector";
import Navbar from "../Components/Navbar";
import StatsCards from "../Components/StatsCards";
import PieChart from "../Components/PieChart";
import LineChart from "../Components/LineChart";
import ReferralCard from "../Components/ReferralCard";
import UrgencyAlert from "../Components/UrgencyAlert";

export default function PHCDashboard() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [phcRequests, setPhcRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({ patient: "", age: "", gender: "", symptoms: "", contactNumber: "", address: "", files: [] });
  const [previewRequest, setPreviewRequest] = useState(null);
  const [alertRequest, setAlertRequest] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Colors
  const bg = dark ? "rgb(4, 23, 42)" : "#f1f0e6ff";
  const card = dark ? "#12152a" : "#ffffff";
  const border = dark ? "#1e2235" : "#e5e7eb";
  const text = dark ? "#e2e8f0" : "#2c3543ff";
  const muted = dark ? "#64748b" : "#94a3b8";
  const inputBg = dark ? "#1a1d2e" : "#f8fafc";
  const inputBorder = dark ? "#2e3150" : "#d1d5db";

  // Fetch Cases from API
  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases');
      // Map API cases to frontend format to minimize component breakage
      const mapped = data.data.map(c => ({
        id: c._id,
        patient: `${c.patient?.firstName} ${c.patient?.lastName}`,
        age: c.patient?.dob ? new Date().getFullYear() - new Date(c.patient.dob).getFullYear() : 'N/A',
        gender: c.patient?.gender || 'N/A',
        symptoms: c.symptoms,
        urgency: "Pending Evaluation", // Typically updated by bot/specialist
        status: c.status,
        timestamp: c.createdAt,
        suspected: "Analyzing...",
        files: c.files || []
      }));
      setPhcRequests(mapped);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handlePreview = () => {
    if (!form.patient || !form.symptoms) return alert("Patient name and symptoms are required!");
    const { disease, risk, advice } = detectDisease(form.symptoms);
    
    setPreviewRequest({
      patient: form.patient,
      age: form.age,
      gender: form.gender,
      symptoms: form.symptoms,
      suspected: disease,
      urgency: risk,
      advice,
      files: form.files
    });
  };

  const handleConfirmSubmit = async () => {
    if (!previewRequest) return;
    
    try {
      // Split name blindly for MVP
      const names = previewRequest.patient.split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || 'Unknown';
      const fakeDob = new Date();
      if(previewRequest.age) fakeDob.setFullYear(fakeDob.getFullYear() - parseInt(previewRequest.age));

      // 1. Create Patient & Case
      const { data: resData } = await api.post('/cases/patient', {
        firstName,
        lastName,
        dob: fakeDob.toISOString(),
        gender: previewRequest.gender === 'M' ? 'Male' : previewRequest.gender === 'F' ? 'Female' : 'Other',
        contactNumber: form.contactNumber || '0000000000',
        address: form.address || 'Local Village',
        symptoms: previewRequest.symptoms
      });

      const newCaseId = resData.case._id;

      // 2. Upload Files
      if(previewRequest.files && previewRequest.files.length > 0) {
        for(let file of previewRequest.files) {
          const formData = new FormData();
          formData.append('file', file);
          await api.post(`/cases/${newCaseId}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      setForm({ patient: "", age: "", gender: "", symptoms: "", contactNumber: "", address: "", files: [] });
      setPreviewRequest(null);
      setActiveTab("list");
      
      // Refresh list
      fetchCases();

    } catch (err) {
      alert("Error submitting case. Check console.");
      console.error(err);
    }
  };

  const cancelPreview = () => setPreviewRequest(null);

  const filteredRequests = phcRequests.filter(r =>
    !search ||
    r.patient?.toLowerCase().includes(search.toLowerCase()) ||
    r.symptoms?.toLowerCase().includes(search.toLowerCase())
  );

  const Tab = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        background: activeTab === id ? (dark ? "#1e3a6e" : "#dbeafe") : "transparent",
        color: activeTab === id ? (dark ? "#60a5fa" : "#1d4ed8") : muted,
        border: "none", borderRadius: "8px", padding: "8px 16px",
        fontWeight: activeTab === id ? 700 : 500, fontSize: "13px",
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", gap: "5px",
      }}
    >
      {icon} {label}
    </button>
  );

  if(loading) return <div style={{padding: '50px', textAlign: 'center', color: text}}>Loading Dashboard...</div>;

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Inter', system-ui, sans-serif", color: text, margin: 0 }}>
      <Navbar role="phc" />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: text }}>
            🏥 Primary Health Centres (PHCs)
          </h1>
          <p style={{ margin: "4px 0 0", color: muted, fontSize: "18px" }}>
            Welcome back, {user?.name || "Healthcare Worker"}.
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
          <div className="premium-card" style={{ padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "17px", color: text }}>📝 New Patient Referral</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              {[
                { key: "patient", placeholder: "Full Name *", type: "text" },
                { key: "age", placeholder: "Age", type: "number" },
                { key: "gender", placeholder: "Gender (M/F/Other)", type: "text" },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key} type={type} placeholder={placeholder} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ padding: "10px 14px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none" }}
                />
              ))}
            </div>

            <textarea
              placeholder="Describe Symptoms in detail *"
              value={form.symptoms}
              onChange={e => setForm({ ...form, symptoms: e.target.value })}
              rows={4}
              style={{ width: "100%", padding: "12px 14px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: "12px" }}
            />

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px" }}>📎 Upload Files (Limit 10MB)</label>
              <input type="file" multiple onChange={e => setForm({ ...form, files: Array.from(e.target.files) })} style={{ fontSize: "13px", color: text }} />
            </div>

            {!previewRequest ? (
              <button onClick={handlePreview} className="btn btn-primary" style={{ width: '100%' }}> Preview Referral 👁️ </button>
            ) : (
              <div style={{ background: dark ? "#1e293b" : "#f8fafc", border: `1px solid ${border}`, borderRadius: "12px", padding: "20px", marginTop: "20px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: text, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#3b82f6" }}>ℹ️</span> Review Referral Details
                </h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "1rem" }}>
                  <button onClick={handleConfirmSubmit} className="btn btn-primary">Confirm & Send to Urban →</button>
                  <button onClick={cancelPreview} className="btn" style={{ background: inputBg, color: text, border: `1px solid ${inputBorder}` }}>Edit Details</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LIST TAB */}
        {activeTab === "list" && (
          <div>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }}>🔍</span>
              <input placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            {filteredRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: muted }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                <p>No cases found.</p>
              </div>
            ) : (
              [...filteredRequests].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(r => <ReferralCard key={r.id} {...r} />)
            )}
          </div>
        )}
      </div>
      
      {alertRequest && <UrgencyAlert request={alertRequest} onClose={() => setAlertRequest(null)} />}
    </div>
  );
}