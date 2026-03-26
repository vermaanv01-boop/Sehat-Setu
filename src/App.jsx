import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

import Home from "./pages/Homepage";
import Login from "./pages/Login";
import PHCDashboard from "./pages/PHCDashboard";
import UrbanDashboard from "./pages/UrbanDashboard";
import History from "./pages/History";
import Locations from "./pages/Locations";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="/locations" 
            element={
              <ProtectedRoute>
                <Locations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/phc/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['healthcare_worker']}>
                <PHCDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/urban/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <UrbanDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history/:role" 
            element={
              <ProtectedRoute>
                <HistoryWrapper />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function HistoryWrapper() {
  const { role } = useParams();
  return <History role={role} />;
}