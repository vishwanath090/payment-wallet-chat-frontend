// src/components/Navbar.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [hoveredItem, setHoveredItem] = useState(null);

  // Navigation items with colors
  const navItems = [
    { 
      path: "/dashboard", 
      icon: "🏠", 
      label: "Home", 
      color: "rgba(139, 92, 246, 0.8)",
      gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))"
    },
    { 
      path: "/history", 
      icon: "📊", 
      label: "History", 
      color: "rgba(59, 130, 246, 0.8)",
      gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))"
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Floating Glass Navbar - Vertical Bar */}
      <nav
        style={{
          position: "fixed",
          top: "25px",
          right: "25px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(30px) saturate(200%)",
          borderRadius: "20px",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.2),
            0 8px 32px rgba(31, 38, 135, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* Home Button */}
        <button
          onClick={() => handleNavClick("/dashboard")}
          onMouseEnter={() => setHoveredItem('home')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            background: location.pathname === "/dashboard" 
              ? "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))"
              : hoveredItem === 'home'
              ? "linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(99, 102, 241, 0.7))"
              : "rgba(255, 255, 255, 0.08)",
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            border: location.pathname === "/dashboard" 
              ? "1px solid rgba(255, 255, 255, 0.4)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            transition: "all 0.3s ease",
            transform: hoveredItem === 'home' ? "translateY(-2px) scale(1.05)" : "scale(1)",
            boxShadow: location.pathname === "/dashboard"
              ? "0 8px 25px rgba(139, 92, 246, 0.4)"
              : hoveredItem === 'home'
              ? "0 6px 20px rgba(139, 92, 246, 0.3)"
              : "0 4px 15px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ 
            fontSize: "20px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            transition: "all 0.3s ease",
            transform: hoveredItem === 'home' ? "scale(1.1)" : "scale(1)",
          }}>
            🏠
          </div>
          <span style={{ 
            fontSize: "10px", 
            fontWeight: "600",
            letterSpacing: "0.3px",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}>
            Home
          </span>
        </button>

        {/* History Button */}
        <button
          onClick={() => handleNavClick("/history")}
          onMouseEnter={() => setHoveredItem('history')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            background: location.pathname === "/history" 
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))"
              : hoveredItem === 'history'
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.7), rgba(37, 99, 235, 0.7))"
              : "rgba(255, 255, 255, 0.08)",
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            border: location.pathname === "/history" 
              ? "1px solid rgba(255, 255, 255, 0.4)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            transition: "all 0.3s ease",
            transform: hoveredItem === 'history' ? "translateY(-2px) scale(1.05)" : "scale(1)",
            boxShadow: location.pathname === "/history"
              ? "0 8px 25px rgba(59, 130, 246, 0.4)"
              : hoveredItem === 'history'
              ? "0 6px 20px rgba(59, 130, 246, 0.3)"
              : "0 4px 15px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ 
            fontSize: "20px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            transition: "all 0.3s ease",
            transform: hoveredItem === 'history' ? "scale(1.1)" : "scale(1)",
          }}>
            📊
          </div>
          <span style={{ 
            fontSize: "10px", 
            fontWeight: "600",
            letterSpacing: "0.3px",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}>
            History
          </span>
        </button>

        {/* Separator Line */}
        <div style={{
          width: "40px",
          height: "1px",
          background: "rgba(255, 255, 255, 0.2)",
          margin: "4px 0",
          borderRadius: "1px",
        }} />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            background: hoveredItem === 'logout'
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))"
              : "rgba(239, 68, 68, 0.7)",
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            transition: "all 0.3s ease",
            transform: hoveredItem === 'logout' ? "translateY(-2px) scale(1.05)" : "scale(1)",
            boxShadow: hoveredItem === 'logout'
              ? "0 6px 20px rgba(239, 68, 68, 0.4)"
              : "0 4px 15px rgba(239, 68, 68, 0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ 
            fontSize: "20px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            transition: "all 0.3s ease",
            transform: hoveredItem === 'logout' ? "scale(1.1)" : "scale(1)",
          }}>
            🚪
          </div>
          <span style={{ 
            fontSize: "10px", 
            fontWeight: "600",
            letterSpacing: "0.3px",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}>
            Logout
          </span>
        </button>
      </nav>

      <style>
        {`
          /* Mobile responsiveness */
          @media (max-width: 768px) {
            nav {
              top: 15px;
              right: 15px;
              padding: 12px 10px;
            }
            
            button {
              width: 55px;
              height: 55px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;