import { useData } from "../context/DataContext";

export default function Analytics() {
  const { requests } = useData();
  const total = requests.length;
  const accepted = requests.filter(r => r.status === "Accepted").length;

  return (
    <div style={{ padding: 20 }}>
      <h2>Analytics</h2>
      <p>Total Requests: {total}</p>
      <p>Accepted: {accepted}</p>
      <p>Pending: {total - accepted}</p>
    </div>
  );
}