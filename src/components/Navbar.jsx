// components/Navbar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 900,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "25px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 1000,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            fontSize: "24px",
            color: "white",
            cursor: "pointer",
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(90deg)" : "rotate(0)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {isOpen && (
          <div style={{ 
            display: "flex", 
            gap: "12px",
          }}>
            <button
              onClick={() => navigateTo("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "14px 16px",
                borderRadius: "18px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                minWidth: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>🏠</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>Home</span>
            </button>

            <button
              onClick={() => navigateTo("/history")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "14px 16px",
                borderRadius: "18px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                minWidth: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>📊</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>History</span>
            </button>

            <button
              onClick={logout}
              style={{
                background: "rgba(239,68,68,0.8)",
                padding: "14px 16px",
                borderRadius: "18px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                minWidth: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>🚪</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;