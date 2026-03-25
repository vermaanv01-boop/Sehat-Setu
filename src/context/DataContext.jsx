import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const stored = localStorage.getItem("requests");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  const addRequest = (request) => {
    setRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...request,
        status: "Pending",   // Default status
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
    <DataContext.Provider value={{ requests, addRequest, updateRequest }}>
      {children}
    </DataContext.Provider>
  );
}