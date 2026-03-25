import diseases from "./diseases.json";

// Map raw risk values from JSON to display urgency levels
const RISK_MAP = {
  RED:    "Critical",
  HIGH:   "High",
  MEDIUM: "Medium",
  YELLOW: "Medium",
  LOW:    "Low",
  GREEN:  "Low",
  Critical: "Critical",
  High:   "High",
  Medium: "Medium",
  Low:    "Low",
};

export function detectDisease(text) {
  if (!text) return { disease: "Unknown", risk: "Low", advice: "Provide symptoms" };

  // Remove punctuation and pad with spaces for accurate whole-word/phrase matching
  const cleanText = " " + text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ") + " ";

  for (let d of diseases) {
    if (d.keywords.some(k => cleanText.includes(" " + k.toLowerCase() + " "))) {
      return {
        disease: d.disease,
        risk: RISK_MAP[d.risk] || "Medium",
        advice: d.advice,
      };
    }
  }

  return {
    disease: "Unknown / Check Symptoms",
    risk: "Low",
    advice: "Consult a doctor for proper diagnosis",
  };
}