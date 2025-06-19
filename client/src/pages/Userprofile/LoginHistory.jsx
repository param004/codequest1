import React, { useEffect, useState } from "react";
import axios from "axios";

const LoginHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const profile = JSON.parse(localStorage.getItem("Profile"));
      if (!profile?.token) return;
      try {
        const { data } = await axios.get(
          `http://localhost:5000/user/login-history/${userId}`,
          { headers: { Authorization: `Bearer ${profile.token}` } }
        );
        setHistory(data);
      } catch (err) {
        setHistory([]);
      }
    }
    fetchHistory();
  }, [userId]);

  if (!history.length) return null;

  return (
    <div className="profile-info-card" style={{ marginTop: 24 }}>
      <h2>Login History</h2>
      <table style={{ width: "100%", fontSize: 14 }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>IP</th>
            <th>Browser</th>
            <th>OS</th>
            <th>Device</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{new Date(h.loginAt).toLocaleString()}</td>
              <td>{h.ip}</td>
              <td>{h.browser}</td>
              <td>{h.os}</td>
              <td>{h.device}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistory;