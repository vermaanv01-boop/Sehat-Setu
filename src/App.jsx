import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

import Home from "./pages/Homepage";
import PHCDashboard from "./pages/PHCDashboard";
import UrbanDashboard from "./pages/UrbanDashboard";
import History from "./pages/History";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phc/dashboard" element={<PHCDashboard />} />
        <Route path="/urban/dashboard" element={<UrbanDashboard />} />
        <Route path="/history/:role" element={<HistoryWrapper />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function HistoryWrapper() {
  const { role } = useParams();
  return <History role={role} />;
}