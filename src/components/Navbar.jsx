// src/components/Navbar.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ FIXED PATH

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // Simple navigation items
  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/history", icon: "📊", label: "History" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Background overlay when menu opens */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 900,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* NAVBAR — Always at TOP RIGHT */}
      <nav
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
          borderRadius: "25px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Expanded menu */}
        {isOpen && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239,68,68,0.8)",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                fontSize: "15px",
                cursor: "pointer",
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
