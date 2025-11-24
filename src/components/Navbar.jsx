// src/components/Navbar.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Glass overlay when menu opens */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Glass Navbar */}
      <nav
        style={{
          position: "fixed",
          top: "25px",
          right: "25px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(30px) saturate(200%)",
          borderRadius: "24px",
          padding: "12px 16px",
          display: "flex",
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
        {/* Elegant Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setHoveredItem('menu')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9))",
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(90deg)" : hoveredItem === 'menu' ? "scale(1.05)" : "scale(1)",
            boxShadow: isOpen 
              ? "0 8px 25px rgba(139, 92, 246, 0.5)" 
              : "0 6px 20px rgba(139, 92, 246, 0.3)",
            filter: hoveredItem === 'menu' ? "brightness(1.1)" : "brightness(1)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Glass Menu Items */}
        {isOpen && (
          <div style={{ 
            display: "flex", 
            gap: "12px",
            animation: "slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  background: location.pathname === item.path 
                    ? item.gradient
                    : hoveredItem === item.path
                    ? `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.12))`
                    : "rgba(255, 255, 255, 0.08)",
                  padding: "14px 18px",
                  borderRadius: "18px",
                  border: location.pathname === item.path 
                    ? "1px solid rgba(255, 255, 255, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "100px",
                  minHeight: "65px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  backdropFilter: "blur(20px)",
                  transform: hoveredItem === item.path ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: location.pathname === item.path
                    ? `0 12px 30px ${item.color.replace('0.8', '0.25')}`
                    : hoveredItem === item.path
                    ? `0 8px 25px ${item.color.replace('0.8', '0.15')}`
                    : "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ 
                  fontSize: "22px",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  transition: "all 0.3s ease",
                  transform: hoveredItem === item.path ? "scale(1.15)" : "scale(1)",
                }}>
                  {item.icon}
                </div>
                <span style={{ 
                  fontSize: "12px", 
                  fontWeight: "600",
                  letterSpacing: "0.3px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}>
                  {item.label}
                </span>
              </button>
            ))}

            {/* Glass Logout Button */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                background: hoveredItem === 'logout'
                  ? "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))"
                  : "rgba(239, 68, 68, 0.7)",
                padding: "14px 18px",
                borderRadius: "18px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "100px",
                minHeight: "65px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(20px)",
                transform: hoveredItem === 'logout' ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoveredItem === 'logout'
                  ? "0 8px 25px rgba(239, 68, 68, 0.3)"
                  : "0 4px 15px rgba(239, 68, 68, 0.15)",
              }}
            >
              <div style={{ 
                fontSize: "22px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "all 0.3s ease",
                transform: hoveredItem === 'logout' ? "scale(1.15)" : "scale(1)",
              }}>
                🚪
              </div>
              <span style={{ 
                fontSize: "12px", 
                fontWeight: "600",
                letterSpacing: "0.3px",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}>
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
            from {
              opacity: 0;
              transform: translateX(15px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            nav {
              top: 15px;
              right: 15px;
              padding: 10px 14px;
            }
            
            nav > div {
              flex-direction: column;
              max-height: 60vh;
              overflow-y: auto;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;