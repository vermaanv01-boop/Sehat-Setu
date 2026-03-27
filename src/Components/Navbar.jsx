import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/SEHAT SETU LOGO.jpeg";

export default function Navbar({ role }) {
  const { dark, toggle } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const bg = dark ? "#12141b" : "#ffffff";
  const border = dark ? "#1e2030" : "#f0f4f8";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const brand = "#0f766e";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, label, icon }) => {
    const active = location.pathname === to;
    return (
      <button
        onClick={() => navigate(to)}
        style={{
          background: active ? (dark ? "#1a3a38" : "#e6f7f5") : "transparent",
          color: active ? brand : (dark ? "#94a3b8" : "#64748b"),
          border: "none",
          borderRadius: "8px",
          padding: "7px 14px",
          fontSize: "13px",
          fontWeight: active ? 700 : 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = dark ? "#1e2030" : "#f8fafc"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        <span>{icon}</span>{label}
      </button>
    );
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: bg,
      borderBottom: `1px solid ${border}`,
      boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.03)",
      padding: "0 20px",
      height: "58px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transition: "background 0.3s",
    }}>
      {/* Brand */}
      <div
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <img
          src={logo}
          alt="SehatSetu Logo"
          style={{ height: "42px", objectFit: "contain", borderRadius: "6px" }}
        />
        <h2 style={{
          margin: 0,
          marginLeft: "12px",
          fontWeight: 800,
          fontSize: "22px",
          letterSpacing: "-0.5px",
          background: "linear-gradient(135deg, #0f766e, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          SehatSetu
        </h2>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <NavLink to="/" label="Home" icon="" />
        {role === "phc" && (
          <>
            <NavLink to="/phc/dashboard" label="Dashboard" icon="" />
            <NavLink to="/locations" label="Facility Map" icon="📍 " />
            <NavLink to="/history/phc" label="History" icon="" />
          </>
        )}
        {role === "urban" && (
          <>
            <NavLink to="/urban/dashboard" label="Dashboard" icon="" />
            <NavLink to="/locations" label="Facility Map" icon="📍 " />
            <NavLink to="/history/urban" label="History" icon="" />
          </>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            background: dark ? "#1e2030" : "#f1f5f9",
            border: `1px solid ${dark ? "#2e3150" : "#e2e8f0"}`,
            borderRadius: "8px",
            padding: "7px 10px",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "6px",
            transition: "all 0.2s",
          }}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: "transparent",
            border: `1px solid ${dark ? "#ef444466" : "#fca5a5"}`,
            color: "#ef4444",
            borderRadius: "8px",
            padding: "7px 12px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            marginLeft: "6px",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#ef444411"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}