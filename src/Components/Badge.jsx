import React from "react";
import { URGENCY_STYLE, STATUS_STYLE } from "../styles/styles";

export default function Badge({ label, type = "status" }) {
  const style = type === "urgency" ? URGENCY_STYLE[label] : STATUS_STYLE[label];
  if (!style || !label) return null;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      background: style.bg,
      color: style.text,
      fontSize: "11px",
      fontWeight: 700,
      padding: "3px 10px",
      borderRadius: "20px",
      border: `1px solid ${style.text}33`,
      letterSpacing: "0.4px",
    }}>
      {type === "urgency" && (
        <span style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: style.dot || style.text,
          display: "inline-block",
          flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
}