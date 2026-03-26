import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import Navbar from "../Components/Navbar";
import StatsCards from "../Components/StatsCards";
import PieChart from "../Components/PieChart";
import LineChart from "../Components/LineChart";
import ReferralCard from "../Components/ReferralCard";
import UrgencyAlert from "../Components/UrgencyAlert";

export default function UrbanDashboard() {
  const { dark } = useTheme();
  const { user } = useAuth();
  
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertRequest, setAlertRequest] = useState(null);

  const bg = dark ? "#0d0f1a" : "#f1f0e6ff";
  const card = dark ? "#12152a" : "#ffffff";
  const border = dark ? "#1e2235" : "#e5e7eb";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#64748b" : "#94a3b8";
  const inputBg = dark ? "#1a1d2e" : "#f8fafc";
  const inputBorder = dark ? "#2e3150" : "#d1d5db";

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases');
      const mapped = data.data.map(c => ({
        id: c._id,
        patient: `${c.patient?.firstName} ${c.patient?.lastName}`,
        age: c.patient?.dob ? new Date().getFullYear() - new Date(c.patient.dob).getFullYear() : 'N/A',
        symptoms: c.symptoms,
        status: c.status,
        urgency: "Pending", // Usually evaluated locally
        timestamp: c.createdAt,
        suspected: c.notes || "Awaiting specialist review"
      }));
      setAllRequests(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();

    // Setup Socket.io
    const socket = io("http://localhost:5000");
    
    socket.on("new_case", (newCaseData) => {
      // Re-fetch to guarantee pristine mapping, but we could also inject locally
      fetchCases(); 
      // Add fake urgency based on symptoms for demo toaster
      setAlertRequest({ ...newCaseData, urgency: 'High', patient: 'New PHC Referral' });
    });

    return () => socket.disconnect();
  }, []);

  const pending = allRequests.filter(r => r.status === "Open");

  const handleChange = (id, field, value) => {
    setResponses(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleResponse = async (id) => {
    const res = responses[id] || {};
    if(!res.guidance) return alert("Please provide guidance.");

    try {
      // Send PUT request to backend to assume responsibility and resolve
      await api.put(`/cases/${id}`, {
        status: 'Resolved',
        notes: res.guidance
      });
      
      // Clear response input and refetch
      setResponses(prev => { const n = { ...prev }; delete n[id]; return n; });
      fetchCases();

    } catch(err) {
      console.error(err);
      alert("Error submitting response");
    }
  };

  const filteredPending = pending.filter(r =>
    !search ||
    r.patient?.toLowerCase().includes(search.toLowerCase()) ||
    r.symptoms?.toLowerCase().includes(search.toLowerCase())
  );

  const Tab = ({ id, label, icon, badge }) => (
    <button onClick={() => setActiveTab(id)} style={{ background: activeTab === id ? (dark ? "#1e3a6e" : "#dbeafe") : "transparent", color: activeTab === id ? (dark ? "#60a5fa" : "#1d4ed8") : muted, border: "none", borderRadius: "8px", padding: "8px 16px", fontWeight: activeTab === id ? 700 : 500, fontSize: "13px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "5px", position: "relative" }}>
      {icon} {label}
      {badge > 0 && ( <span style={{ background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "1px 5px", borderRadius: "10px", marginLeft: "2px" }}>{badge}</span> )}
    </button>
  );

  if(loading) return <div style={{padding: '50px', textAlign: 'center', color: text}}>Loading Urban Dashboard...</div>;

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Inter', system-ui, sans-serif", color: text }}>
      <Navbar role="urban" />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: text }}>
            🏢 Urban Hospital Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", color: muted, fontSize: "14px" }}>
            Welcome back Dr. {user?.name || "Specialist"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: dark ? "#12152a" : "#f1f5f9", padding: "4px", borderRadius: "10px", border: `1px solid ${border}`, width: "fit-content" }}>
          <Tab id="dashboard" label="Overview" icon="📊" />
          <Tab id="pending" label="Open Cases" icon="📥" badge={pending.length} />
          <Tab id="all" label="All Assigned Cases" icon="📋" />
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
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted }}>🔍</span>
              <input placeholder="Search open cases..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>

            {filteredPending.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: muted }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                <p>No open cases. All clear!</p>
              </div>
            ) : (
              [...filteredPending].map(r => (
                  <div key={r.id} style={{ marginBottom: "12px" }}>
                    <ReferralCard {...r} />
                    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "0 0 12px 12px", padding: "14px 16px", marginTop: "-8px" }}>
                      <textarea
                        placeholder="Enter diagnosis / specialist notes..."
                        value={responses[r.id]?.guidance || ""}
                        onChange={e => handleChange(r.id, "guidance", e.target.value)}
                        rows={3}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                      />
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: 'flex-end' }}>
                        <button onClick={() => handleResponse(r.id)} className="btn btn-primary">✅ Submit Response & Close Case</button>
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
              <input placeholder="Search all your cases..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: "10px", border: `1px solid ${inputBorder}`, background: inputBg, color: text, fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            {[...allRequests].filter(r => !search || r.patient?.toLowerCase().includes(search.toLowerCase())).map(r => <ReferralCard key={r.id} {...r} />)}
          </div>
        )}
      </div>

      {alertRequest && (
        <UrgencyAlert request={alertRequest} onClose={() => setAlertRequest(null)} />
      )}
    </div>
  );
}