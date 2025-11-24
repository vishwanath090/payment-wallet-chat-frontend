// components/Navbar.js
import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // 🔥 MANUAL ROUTE TRACKING - No dependencies
  useEffect(() => {
    // Listen for route changes
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      console.log('🔄 Route changed to:', newPath);
      setCurrentPath(newPath);
    };

    // Check route on mount
    handleRouteChange();

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);

    // Custom event listener for navigation (we'll trigger this manually)
    window.addEventListener('custom-route-change', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('custom-route-change', handleRouteChange);
    };
  }, []);

  // Manual navigation function
  const navigateTo = (path) => {
    if (path === 'logout') {
      // Handle logout
      console.log('Logging out...');
      // Clear any stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    console.log('Navigating to:', path);
    
    // Update URL without page reload
    window.history.pushState({}, '', path);
    
    // Update current path
    setCurrentPath(path);
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('custom-route-change'));
    
    // Close menu
    setIsOpen(false);
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

  // 🔥 SIMPLE POSITIONING - Based on current path
  const getNavbarStyle = () => {
    const baseStyle = {
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
      transition: "all 0.45s ease",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
      minHeight: "70px",
    };

    // 🔥 MANUAL PATH CHECK
    if (currentPath === '/dashboard') {
      return {
        ...baseStyle,
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)"
      };
    } else {
      return {
        ...baseStyle,
        top: "20px",
        right: "20px"
      };
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

      {/* Debug Info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1001,
        fontFamily: 'monospace',
      }}>
        Path: {currentPath}<br/>
        Position: {currentPath === '/dashboard' ? 'BOTTOM-CENTER' : 'TOP-RIGHT'}
      </div>

      <nav style={getNavbarStyle()}>
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
            {currentPath === '/dashboard' ? '⬇️' : '↗️'}
          </span>
          <span style={{ textTransform: 'capitalize' }}>
            {currentPath === '/dashboard' ? 'bottom center' : 'top right'}
          </span>
        </div>

        {/* Expanded menu */}
        {isOpen && (
          <div style={{ 
            display: "flex", 
            gap: "12px",
            animation: "slideIn 0.3s ease",
            flexWrap: 'wrap',
          }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                style={{
                  background: currentPath === item.path 
                    ? "rgba(139, 92, 246, 0.3)" 
                    : "rgba(255,255,255,0.1)",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  border: currentPath === item.path
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
              onClick={() => navigateTo('logout')}
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
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
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