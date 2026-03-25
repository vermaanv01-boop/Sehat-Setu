export default function NavBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 15px",
        border: "none",
        background: active ? "#f0fdf4" : "transparent",
        color: active ? "#0f766e" : "#374151",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}