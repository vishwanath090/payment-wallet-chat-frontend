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
      {/* Enhanced background overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Enhanced NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: "25px",
          right: "25px",
          zIndex: 1000,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(25px) saturate(180%)",
          borderRadius: "28px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: `
            0 25px 50px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        }}
      >
        {/* Enhanced Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setHoveredItem('menu')}
          onMouseLeave={() => setHoveredItem(null)}
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(59, 130, 246, 0.95))",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            fontSize: "26px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(90deg) scale(1.1)" : hoveredItem === 'menu' ? "scale(1.1)" : "scale(1)",
            boxShadow: isOpen 
              ? "0 12px 30px rgba(139, 92, 246, 0.6)" 
              : "0 8px 25px rgba(139, 92, 246, 0.4)",
            filter: hoveredItem === 'menu' ? "brightness(1.2)" : "brightness(1)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Enhanced Expanded Menu */}
        {isOpen && (
          <div style={{ 
            display: "flex", 
            gap: "14px",
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
                    ? `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.15))`
                    : "rgba(255,255,255,0.1)",
                  padding: "16px 20px",
                  borderRadius: "20px",
                  border: location.pathname === item.path 
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "110px",
                  minHeight: "70px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  backdropFilter: "blur(10px)",
                  transform: hoveredItem === item.path ? "translateY(-2px) scale(1.05)" : "scale(1)",
                  boxShadow: location.pathname === item.path
                    ? `0 15px 35px ${item.color.replace('0.8', '0.3')}`
                    : hoveredItem === item.path
                    ? `0 10px 30px ${item.color.replace('0.8', '0.2')}`
                    : "0 5px 20px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ 
                  fontSize: "24px",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  transition: "all 0.3s ease",
                  transform: hoveredItem === item.path ? "scale(1.2) rotate(5deg)" : "scale(1)",
                }}>
                  {item.icon}
                </div>
                <span style={{ 
                  fontSize: "13px", 
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}>
                  {item.label}
                </span>
              </button>
            ))}

            {/* Enhanced Logout Button */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                background: hoveredItem === 'logout'
                  ? "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))"
                  : "rgba(239, 68, 68, 0.8)",
                padding: "16px 20px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "110px",
                minHeight: "70px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(10px)",
                transform: hoveredItem === 'logout' ? "translateY(-2px) scale(1.05)" : "scale(1)",
                boxShadow: hoveredItem === 'logout'
                  ? "0 10px 30px rgba(239, 68, 68, 0.4)"
                  : "0 5px 20px rgba(239, 68, 68, 0.2)",
              }}
            >
              <div style={{ 
                fontSize: "24px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                transition: "all 0.3s ease",
                transform: hoveredItem === 'logout' ? "scale(1.2) rotate(5deg)" : "scale(1)",
              }}>
                🚪
              </div>
              <span style={{ 
                fontSize: "13px", 
                fontWeight: "700",
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
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
              transform: translateX(20px);
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
              padding: 14px 16px;
            }
            
            nav > div {
              flex-direction: column;
              max-height: 70vh;
              overflow-y: auto;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;