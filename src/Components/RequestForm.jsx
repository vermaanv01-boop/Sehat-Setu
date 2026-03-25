import React, { useState } from "react";
import { useData } from "../context/DataContext";

export default function RequestForm() {
  const { addRequest } = useData(); // function to add request to context
  const [patient, setPatient] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [suspected, setSuspected] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [status, setStatus] = useState("pending");
  const [files, setFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !symptoms) return alert("Patient name and symptoms are required");

    const newRequest = {
      id: Date.now(), // unique ID
      patient,
      age,
      gender,
      symptoms,
      suspected,
      urgency,
      status,
      files: Array.from(files),
      timestamp: new Date(),
      role: "phc" // mark this request for PHC
    };

    addRequest(newRequest);

    // reset form
    setPatient(""); setAge(""); setGender(""); setSymptoms("");
    setSuspected(""); setUrgency("normal"); setStatus("pending");
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <input placeholder="Patient Name" value={patient} onChange={e => setPatient(e.target.value)} required />
      <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
      <input placeholder="Gender" value={gender} onChange={e => setGender(e.target.value)} />
      <input placeholder="Symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} required />
      <input placeholder="Suspected Condition" value={suspected} onChange={e => setSuspected(e.target.value)} />
      <select value={urgency} onChange={e => setUrgency(e.target.value)}>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <input type="file" multiple onChange={e => setFiles(e.target.files)} />
      <button type="submit">Add Request</button>
    </form>
  );
}