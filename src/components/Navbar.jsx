// components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [position, setPosition] = useState(currentPath === '/dashboard' ? "bottom-center" : "top-right");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navbarRef = useRef(null);

  // Manual route tracking
  useEffect(() => {
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      console.log('🔄 Route changed to:', newPath);
      setCurrentPath(newPath);
      
      // Auto-position based on route
      if (newPath === '/dashboard') {
        setPosition("bottom-center");
      } else {
        setPosition("top-right");
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('custom-route-change', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('custom-route-change', handleRouteChange);
    };
  }, []);

  // Drag functionality
  const handleMouseDown = (e) => {
    if (!e.target.closest('button')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Drag right - switch positions
        if (position.includes('left')) setPosition('bottom-center');
        else if (position.includes('center')) setPosition('bottom-right');
        else if (position.includes('right')) setPosition('bottom-left');
      } else {
        // Drag left - switch positions
        if (position.includes('left')) setPosition('bottom-right');
        else if (position.includes('center')) setPosition('bottom-left');
        else if (position.includes('right')) setPosition('bottom-center');
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (!e.target.closest('button')) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;

    if (Math.abs(deltaX) > 60) {
      if (deltaX > 0) {
        if (position.includes('left')) setPosition('bottom-center');
        else if (position.includes('center')) setPosition('bottom-right');
        else if (position.includes('right')) setPosition('bottom-left');
      } else {
        if (position.includes('left')) setPosition('bottom-right');
        else if (position.includes('center')) setPosition('bottom-left');
        else if (position.includes('right')) setPosition('bottom-center');
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = 'grabbing';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
    };
  }, [isDragging, dragStart]);

  // Manual navigation
  const navigateTo = (path) => {
    if (path === 'logout') {
      console.log('Logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    console.log('Navigating to:', path);
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.dispatchEvent(new Event('custom-route-change'));
    setIsOpen(false);
  };

  // Only 3 main buttons like before
  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/history", icon: "📊", label: "History" },
  ];

  // Navbar positioning
  const getNavbarStyle = () => {
    const baseStyle = {
      position: "fixed",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "25px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px 12px",
      zIndex: 1000,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
      transition: isDragging ? 'none' : 'all 0.3s ease',
      cursor: isDragging ? 'grabbing' : 'grab',
      minHeight: '70px',
      touchAction: 'none',
    };

    switch (position) {
      case "bottom-left":
        return { ...baseStyle, bottom: "20px", left: "20px" };
      case "bottom-center":
        return { ...baseStyle, bottom: "20px", left: "50%", transform: "translateX(-50%)" };
      case "bottom-right":
        return { ...baseStyle, bottom: "20px", right: "20px" };
      case "top-left":
        return { ...baseStyle, top: "20px", left: "20px" };
      case "top-center":
        return { ...baseStyle, top: "20px", left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { ...baseStyle, top: "20px", right: "20px" };
      default:
        return currentPath === '/dashboard' 
          ? { ...baseStyle, bottom: "20px", left: "50%", transform: "translateX(-50%)" }
          : { ...baseStyle, top: "20px", right: "20px" };
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

      <nav 
        ref={navbarRef}
        style={getNavbarStyle()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* 3-line drag handle */}
        <div 
          className="drag-handle"
          style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'grab',
            zIndex: 10,
          }}
        >
          <div style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '1px',
          }} />
          <div style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '1px',
          }} />
          <div style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '1px',
          }} />
        </div>

        {/* Home Button */}
        <div style={{ position: 'relative', marginTop: '15px', marginBottom: '16px' }}>
          <button
            onClick={() => navigateTo("/dashboard")}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: currentPath === "/dashboard" 
                ? "rgba(139, 92, 246, 0.3)" 
                : "transparent",
              border: currentPath === "/dashboard" 
                ? "1px solid rgba(255,255,255,0.4)" 
                : "1px solid transparent",
              color: "white",
              padding: "16px 12px",
              borderRadius: "18px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              minHeight: '70px',
              minWidth: '70px',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "6px" }}>🏠</div>
            <span style={{ fontSize: "11px", fontWeight: "700" }}>Home</span>
          </button>
        </div>

        {/* History Button */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <button
            onClick={() => navigateTo("/history")}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: currentPath === "/history" 
                ? "rgba(59, 130, 246, 0.3)" 
                : "transparent",
              border: currentPath === "/history" 
                ? "1px solid rgba(255,255,255,0.4)" 
                : "1px solid transparent",
              color: "white",
              padding: "16px 12px",
              borderRadius: "18px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              minHeight: '70px',
              minWidth: '70px',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "6px" }}>📊</div>
            <span style={{ fontSize: "11px", fontWeight: "700" }}>History</span>
          </button>
        </div>

        {/* Separator */}
        <div style={{
          width: '30px',
          height: '1px',
          background: 'rgba(255,255,255,0.2)',
          margin: '8px 0 16px 0',
          borderRadius: '1px',
        }} />

        {/* Logout Button */}
        <button
          onClick={() => navigateTo("logout")}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "rgba(239, 68, 68, 0.3)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "16px 12px",
            borderRadius: "18px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            minHeight: '70px',
            minWidth: '70px',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>🚪</div>
          <span style={{ fontSize: "11px", fontWeight: "700" }}>Logout</span>
        </button>

        {/* Glass morphism overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
          borderRadius: '25px',
          zIndex: -1
        }} />
      </nav>

      <style>
        {`
          @media (max-width: 768px) {
            nav {
              padding: 16px 8px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;