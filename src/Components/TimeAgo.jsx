import { useState, useEffect } from "react";

export default function TimeAgo({ ts }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // update every 1 min

    return () => clearInterval(interval);
  }, []);

  const d = new Date(ts);
  const diff = Math.floor((now - d.getTime()) / 60000);

  if (diff < 60) return <span>{diff}m ago</span>;
  if (diff < 1440) return <span>{Math.floor(diff / 60)}h ago</span>;
  return <span>{d.toLocaleDateString("en-IN")}</span>;
}