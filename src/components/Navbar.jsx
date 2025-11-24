// components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom-center");
  const navbarRef = useRef(null);

  // 🔥 FIXED: Auto position based on page
  useEffect(() => {
    console.log('Page changed to:', location.pathname);
    
    if (location.pathname === '/dashboard') {
      console.log('Setting position to bottom-center');
      setPosition("bottom-center");
    } else {
      console.log('Setting position to top-left');
      setPosition("top-left");
    }
  }, [location.pathname]); // This will run every time the route changes

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("navbarPosition", position);
  }, [position]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items
  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/history", icon: "📊", label: "History" },
    { path: "/add-money", icon: "💰", label: "Add Money" },
    { path: "/send-money", icon: "💸", label: "Send Money" },
    { path: "/contacts", icon: "👥", label: "Contacts" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  const handleNavClick = (path) => {
    if (path === "logout") {
      handleLogout();
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  // 🔥 SIMPLE POSITIONING - No dragging for now
  const getNavbarStyle = () => {
    const base = {
      position: "fixed",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "25px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      zIndex: 1000,
      transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
      minHeight: "70px",
    };

    // Debug current position
    console.log('Current navbar position:', position);

    switch (position) {
      case "top-left":
        return { ...base, top: "20px", left: "20px" };
      case "top-center":
        return { ...base, top: "20px", left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { ...base, top: "20px", right: "20px" };
      case "bottom-left":
        return { ...base, bottom: "20px", left: "20px" };
      case "bottom-center":
        return { ...base, bottom: "20px", left: "50%", transform: "translateX(-50%)" };
      case "bottom-right":
        return { ...base, bottom: "20px", right: "20px" };
      default:
        return { ...base, bottom: "20px", left: "50%", transform: "translateX(-50%)" };
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 900,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Position Debug Info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1001,
      }}>
        Page: {location.pathname}<br/>
        Navbar: {position}
      </div>

      <nav
        ref={navbarRef}
        style={getNavbarStyle()}
      >
        {/* Main button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            borderRadius: "50%",
            width: "56px",
            height: "56px",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(90deg)" : "rotate(0)",
            boxShadow: "0 8px 20px rgba(139, 92, 246, 0.4)",
            flexShrink: 0,
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Position Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: '12px',
          color: 'white',
          fontWeight: '600',
          minWidth: '80px',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ fontSize: '14px' }}>
            {position === 'top-left' ? '↖️' : 
             position === 'top-center' ? '⬆️' :
             position === 'top-right' ? '↗️' :
             position === 'bottom-left' ? '↙️' : 
             position === 'bottom-center' ? '⬇️' : '↘️'}
          </span>
          <span style={{ textTransform: 'capitalize' }}>
            {position.replace('-', ' ')}
          </span>
        </div>

        {/* Expanded menu */}
        {isOpen && (
          <div style={{ 
            display: "flex", 
            gap: "12px",
            animation: "slideInRight 0.3s ease",
            flexWrap: 'wrap',
          }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  background: location.pathname === item.path 
                    ? "rgba(139, 92, 246, 0.3)" 
                    : "rgba(255,255,255,0.1)",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  border: location.pathname === item.path
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "100px",
                  minHeight: "60px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>{item.label}</span>
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={() => handleNavClick("logout")}
              style={{
                background: "rgba(239,68,68,0.8)",
                padding: "14px 16px",
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                cursor: "pointer",
                minWidth: "100px",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <span style={{ fontSize: "20px" }}>🚪</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>Logout</span>
            </button>
          </div>
        )}
      </nav>

      <style>
        {`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @media (max-width: 768px) {
            nav {
              padding: 14px 16px;
              max-width: 95vw;
            }
            
            nav > div:last-child {
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