import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/cases');
      // Map API cases to frontend format
      const mapped = data.data.map(c => ({
        id: c._id,
        patient: `${c.patient?.firstName || 'Unknown'} ${c.patient?.lastName || ''}`,
        age: c.patient?.dob ? new Date().getFullYear() - new Date(c.patient.dob).getFullYear() : 'N/A',
        gender: c.patient?.gender || 'N/A',
        symptoms: c.symptoms,
        urgency: c.urgency || "Low", // Default if not evaluated
        status: c.status,
        timestamp: c.createdAt,
        suspected: c.notes || "Evaluation Pending",
        files: c.files || [],
        role: "phc" // Default role for history categorization
      }));
      setRequests(mapped);
    } catch (error) {
      console.error("Failed to fetch history in DataProvider:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const addRequest = (request) => {
    // For local additions (optimistic UI or mock)
    setRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...request,
        status: "Pending",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const updateRequest = (id, updates) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  return (
    <DataContext.Provider value={{ requests, loading, addRequest, updateRequest, refresh: fetchRequests }}>
      {children}
    </DataContext.Provider>
  );
}