// components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom-center"); // default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const navRef = useRef(null);

  // 🔥 Auto reposition based on page
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setPosition("bottom-center");
    } else {
      setPosition("top-right");
    }
  }, [location.pathname]);

  // --- DRAG START ---
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseDown = (e) => {
    if (!e.target.closest("button")) startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (!e.target.closest("button")) {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
    }
  };

  // --- DRAG MOVE ---
  const onDragMove = (dx) => {
    if (dx > 50) setPosition("top-right");
    else if (dx < -50) setPosition("top-left");
  };

  const handleMouseMove = (e) => {
    if (isDragging) onDragMove(e.clientX - dragStart.x);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    onDragMove(t.clientX - dragStart.x);
  };

  // --- DRAG END ---
  const endDrag = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", endDrag);

      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", endDrag);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", endDrag);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", endDrag);
    }
  }, [isDragging]);

  // --- COMPUTE STYLE ---
  const getStyle = () => {
    const s = {
      position: "fixed",
      zIndex: 1000,
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(20px)",
      borderRadius: "25px",
      padding: "14px 18px",
      display: "flex",
      gap: "12px",
      transition: "all 0.4s ease",
      cursor: isDragging ? "grabbing" : "grab"
    };

    if (position === "bottom-center") {
      return { ...s, bottom: "25px", left: "50%", transform: "translateX(-50%)" };
    }
    if (position === "top-right") {
      return { ...s, top: "20px", right: "20px" };
    }
    if (position === "top-left") {
      return { ...s, top: "20px", left: "20px" };
    }

    return s;
  };

  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/history", icon: "📊", label: "History" }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 900
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        ref={navRef}
        style={getStyle()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            fontSize: "24px",
            color: "white",
            cursor: "pointer"
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {isOpen && (
          <div style={{ display: "flex", gap: "12px" }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}

            <button
              onClick={() => logout()}
              style={{
                background: "rgba(239,68,68,0.8)",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                cursor: "pointer"
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
