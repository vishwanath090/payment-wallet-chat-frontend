// components/Navbar.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // Simple navigation click
  const go = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Background overlay when menu is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 900,
          }}
        />
      )}

      {/* SIMPLE FIXED TOP-RIGHT NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          padding: "16px",
          borderRadius: "20px",
          display: "flex",
          gap: "12px",
          transition: "all 0.3s ease",
        }}
      >
        {/* MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "none",
            fontSize: "22px",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* MENU ITEMS */}
        {isOpen && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => go("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "10px 14px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
              }}
            >
              🏠 Home
            </button>

            <button
              onClick={() => go("/history")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "10px 14px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
              }}
            >
              📊 History
            </button>

            <button
              onClick={logout}
              style={{
                background: "rgba(239,68,68,0.85)",
                padding: "10px 14px",
                borderRadius: "14px",
                border: "none",
                color: "white",
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
