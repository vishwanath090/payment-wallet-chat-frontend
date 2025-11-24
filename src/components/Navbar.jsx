// components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState("bottom-center");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navbarRef = useRef(null);

  // Restore saved position
  useEffect(() => {
    const saved = localStorage.getItem("navbarPosition");
    if (saved) setPosition(saved);
  }, []);

  // Save position
  useEffect(() => {
    localStorage.setItem("navbarPosition", position);
  }, [position]);

  // Auto reposition logic
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setPosition("bottom-center");
    } else {
      setPosition("top-left");
    }
  }, [location.pathname]);

  // Dragging mechanics
  const handleMouseDown = (e) => {
    if (!e.target.closest("button")) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;

    if (deltaX > 50) setPosition("top-right");
    if (deltaX < -50) setPosition("top-left");
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (!e.target.closest("button")) {
      const t = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: t.clientX, y: t.clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const t = e.touches[0];
    const deltaX = t.clientX - dragStart.x;

    if (deltaX > 60) setPosition("top-right");
    if (deltaX < -60) setPosition("top-left");
  };

  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }
  }, [isDragging]);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Only the required 3 buttons:
  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/history", icon: "📊", label: "History" }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Navbar position styling
  const getNavbarStyle = () => {
    const base = {
      position: "fixed",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(20px)",
      borderRadius: "25px",
      padding: "16px 20px",
      display: "flex",
      gap: "12px",
      zIndex: 1000,
      cursor: isDragging ? "grabbing" : "grab",
      transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    switch (position) {
      case "top-left":
        return { ...base, top: "20px", left: "20px" };

      case "top-right":
        return { ...base, top: "20px", right: "20px" };

      case "bottom-center":
      default:
        return {
          ...base,
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
        };
    }
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
        {/* Menu toggle button */}
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
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Menu Items */}
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
