import { useEffect, useState } from "react";

function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call your local backend to register the visit and get updated count
    fetch("https://visitors-production.up.railway.app/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        console.log("Visit data:", data);
        setCount(data.count);
      })
      .catch((err) => {
        console.error("Error fetching visit count:", err);
        setError("Failed to connect");
      });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "gray",
        padding: "8px 12px",
        borderRadius: "10px",
        fontFamily: "monospace",
        fontSize: "10px",
      }}
    >
      {error
        ? `❌ ${error}`
        : count !== null
        ? `${count} Visitors`
        : " Connecting..."}
    </div>
  );
}

export default VisitorCounter;
