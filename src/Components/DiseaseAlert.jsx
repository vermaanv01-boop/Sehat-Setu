import React from "react";
import { detectDisease } from "../utils/diseaseDetector";

const riskColors = {
  HIGH: "red",
  MEDIUM: "orange",
  LOW: "green"
};

export default function DiseaseAlert({ symptoms }) {
  const result = detectDisease(symptoms);

  return (
    <div style={{
      padding: 10,
      border: "1px solid #ccc",
      borderRadius: 8,
      marginTop: 10,
      backgroundColor: "#f9f9f9"
    }}>
      <h3 style={{ color: riskColors[result.risk] || "black" }}>
        {result.disease} ({result.risk})
      </h3>
      <p>{result.advice}</p>
    </div>
  );
}