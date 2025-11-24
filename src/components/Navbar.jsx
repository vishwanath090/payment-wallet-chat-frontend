// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [hoveredItem, setHoveredItem] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-hide in chat section
  useEffect(() => {
    if (location.pathname === '/chat') {
      setIsCollapsed(true);
      setIsVisible(false);
    } else {
      setIsCollapsed(false);
      setIsVisible(true);
    }
  }, [location.pathname]);

  // Auto-hide after inactivity
  useEffect(() => {
    if (location.pathname === '/chat' && !isCollapsed) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      const resetTimer = () => {
        setIsVisible(true);
        clearTimeout(timer);
        setTimeout(() => setIsVisible(false), 3000);
      };

      document.addEventListener('mousemove', resetTimer);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousemove', resetTimer);
      };
    }
  }, [location.pathname, isCollapsed]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleNavbar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsVisible(true);
    } else {
      setIsCollapsed(true);
      setIsVisible(false);
    }
  };

  // Don't show collapsed arrow on non-chat pages
  if (location.pathname !== '/chat' && isCollapsed) {
    setIsCollapsed(false);
    setIsVisible(true);
  }

  return (
    <>
      {/* Collapsed Arrow - Only show in chat section when collapsed */}
      {location.pathname === '/chat' && isCollapsed && (
        <button
          onClick={toggleNavbar}
          onMouseEnter={() => setIsVisible(true)}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "12px",
            width: "45px",
            height: "45px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            opacity: isVisible ? 1 : 0.3,
          }}
        >
          ▶
        </button>
      )}

      {/* Main Navbar - Hidden when collapsed in chat */}
      {!isCollapsed && (
        <nav
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(30px) saturate(200%)",
            borderRadius: "18px",
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.2),
              0 8px 32px rgba(31, 38, 135, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            transition: "all 0.4s ease",
            opacity: isVisible ? 1 : location.pathname === '/chat' ? 0.3 : 1,
          }}
          onMouseEnter={() => location.pathname === '/chat' && setIsVisible(true)}
          onMouseLeave={() => location.pathname === '/chat' && setTimeout(() => setIsVisible(false), 1000)}
        >
          {/* Close button for chat section */}
          {location.pathname === '/chat' && (
            <button
              onClick={toggleNavbar}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "5px",
              }}
            >
              ◀
            </button>
          )}

          {/* Home Button */}
          <button
            onClick={() => handleNavClick("/dashboard")}
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              background: location.pathname === "/dashboard" 
                ? "rgba(139, 92, 246, 0.7)"
                : hoveredItem === 'home'
                ? "rgba(139, 92, 246, 0.3)"
                : "rgba(255, 255, 255, 0.05)",
              width: "55px",
              height: "55px",
              borderRadius: "14px",
              border: location.pathname === "/dashboard" 
                ? "1px solid rgba(255, 255, 255, 0.4)"
                : "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              transition: "all 0.3s ease",
              transform: hoveredItem === 'home' ? "scale(1.05)" : "scale(1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ fontSize: "18px" }}>🏠</div>
            <span style={{ fontSize: "9px", fontWeight: "600" }}>Home</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => handleNavClick("/history")}
            onMouseEnter={() => setHoveredItem('history')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              background: location.pathname === "/history" 
                ? "rgba(59, 130, 246, 0.7)"
                : hoveredItem === 'history'
                ? "rgba(59, 130, 246, 0.3)"
                : "rgba(255, 255, 255, 0.05)",
              width: "55px",
              height: "55px",
              borderRadius: "14px",
              border: location.pathname === "/history" 
                ? "1px solid rgba(255, 255, 255, 0.4)"
                : "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              transition: "all 0.3s ease",
              transform: hoveredItem === 'history' ? "scale(1.05)" : "scale(1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ fontSize: "18px" }}>📊</div>
            <span style={{ fontSize: "9px", fontWeight: "600" }}>History</span>
          </button>

          {/* Separator */}
          <div style={{
            width: "35px",
            height: "1px",
            background: "rgba(255, 255, 255, 0.2)",
            margin: "2px 0",
          }} />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              background: hoveredItem === 'logout'
                ? "rgba(239, 68, 68, 0.8)"
                : "rgba(239, 68, 68, 0.5)",
              width: "55px",
              height: "55px",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              transition: "all 0.3s ease",
              transform: hoveredItem === 'logout' ? "scale(1.05)" : "scale(1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ fontSize: "18px" }}>🚪</div>
            <span style={{ fontSize: "9px", fontWeight: "600" }}>Logout</span>
          </button>
        </nav>
      )}
    </>
  );
};

export default Navbar;