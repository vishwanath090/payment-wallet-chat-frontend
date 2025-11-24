// src/components/Navbar.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isChatPage = location.pathname.startsWith("/chat");

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { 
      path: "/dashboard", 
      icon: "🏠", 
      label: "Home", 
      color: "rgba(139, 92, 246, 0.8)",
      gradient: "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(99,102,241,0.9))"
    },
    { 
      path: "/history", 
      icon: "📊", 
      label: "History", 
      color: "rgba(59,130,246,0.8)",
      gradient: "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(37,99,235,0.9))"
    },
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
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Vertical Glass Navbar */}
      <nav
        style={{
          position: "fixed",
          top: isChatPage ? "90px" : "25px",
          right: isChatPage ? "-5px" : "25px",
          zIndex: 1000,
          width: isChatPage ? "70px" : isOpen ? "85px" : "65px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(25px) saturate(200%)",
          borderRadius: "30px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isChatPage ? "10px" : "14px",
          transition: "all 0.35s ease",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        }}
      >

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setHoveredItem("menu")}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(59,130,246,0.9))",
            width: isChatPage ? "42px" : "48px",
            height: isChatPage ? "42px" : "48px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.3s ease",
            transform: isOpen
              ? "rotate(90deg)"
              : hoveredItem === "menu"
              ? "scale(1.05)"
              : "scale(1)",
            boxShadow: "0 6px 20px rgba(139,92,246,0.4)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Vertical Menu Items */}
        {isOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isChatPage ? "10px" : "14px",
              animation: "slideIn 0.4s ease",
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  background:
                    location.pathname === item.path
                      ? item.gradient
                      : hoveredItem === item.path
                      ? `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.12))`
                      : "rgba(255,255,255,0.08)",
                  width: isChatPage ? "55px" : "60px",
                  height: isChatPage ? "60px" : "70px",
                  borderRadius: "18px",
                  border:
                    location.pathname === item.path
                      ? "1px solid rgba(255,255,255,0.4)"
                      : "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  cursor: "pointer",
                  transition: "0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  boxShadow:
                    hoveredItem === item.path
                      ? `0 8px 20px ${item.color.replace("0.8", "0.25")}`
                      : "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    fontSize: isChatPage ? "18px" : "22px",
                    transition: "0.3s ease",
                    transform:
                      hoveredItem === item.path ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    fontSize: isChatPage ? "10px" : "11px",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                background:
                  hoveredItem === "logout"
                    ? "linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))"
                    : "rgba(239,68,68,0.7)",
                width: isChatPage ? "55px" : "60px",
                height: isChatPage ? "60px" : "70px",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                cursor: "pointer",
                transition: "0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                boxShadow:
                  hoveredItem === "logout"
                    ? "0 8px 20px rgba(239,68,68,0.25)"
                    : "0 4px 12px rgba(239,68,68,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: isChatPage ? "18px" : "22px",
                  transition: "0.3s ease",
                  transform:
                    hoveredItem === "logout" ? "scale(1.1)" : "scale(1)",
                }}
              >
                🚪
              </div>
              <span style={{ fontSize: isChatPage ? "10px" : "11px", fontWeight: 600 }}>
                Logout
              </span>
            </button>
          </div>
        )}
      </nav>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
