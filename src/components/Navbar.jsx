// components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  /* ------------------------------
      SIMPLE POSITIONING
  ------------------------------ */
  const setPosition = (pos) => {
    const el = navRef.current;
    if (!el) return;

    el.style.transition = "all 0.35s ease";

    // Clear old positions
    el.style.top = "";
    el.style.bottom = "";
    el.style.left = "";
    el.style.right = "";
    el.style.transform = "";

    if (pos === "bottom-center") {
      el.style.bottom = "25px";
      el.style.left = "50%";
      el.style.transform = "translateX(-50%)";
    } else if (pos === "top-right") {
      el.style.top = "20px";
      el.style.right = "20px";
    }
  };

  /* ------------------------------
      INITIAL POSITION
  ------------------------------ */
  useEffect(() => {
    setPosition("bottom-center");
  }, []);

  /* ------------------------------
      EASY DRAG - ANYWHERE ON NAVBAR
  ------------------------------ */
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseDown = (e) => {
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const el = navRef.current;
    if (!el) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // Move navbar with cursor
    const rect = el.getBoundingClientRect();
    const newX = rect.left + dx;
    const newY = rect.top + dy;

    el.style.left = `${newX}px`;
    el.style.top = `${newY}px`;
    el.style.transform = "none";
    el.style.bottom = "";
    el.style.right = "";
    
    // Update drag start for next movement
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    
    const el = navRef.current;
    if (!el) return;

    const dx = touch.clientX - dragStart.x;
    const dy = touch.clientY - dragStart.y;

    const rect = el.getBoundingClientRect();
    const newX = rect.left + dx;
    const newY = rect.top + dy;

    el.style.left = `${newX}px`;
    el.style.top = `${newY}px`;
    el.style.transform = "none";
    el.style.bottom = "";
    el.style.right = "";
    
    setDragStart({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  };

  const endDrag = () => {
    setIsDragging(false);
  };

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

  /* ------------------------------
      NAVIGATION
  ------------------------------ */
  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 900,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        ref={navRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
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
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          cursor: isDragging ? "grabbing" : "grab",
          minHeight: "70px",
          touchAction: "none",
        }}
      >
        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            fontSize: "24px",
            color: "white",
            cursor: "pointer",
            background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            transform: isOpen ? "rotate(90deg)" : "rotate(0)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Expanded Menu */}
        {isOpen && (
          <div style={{ 
            display: "flex", 
            gap: "12px",
            animation: "slideIn 0.3s ease",
          }}>
            <button
              onClick={() => navigateTo("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "14px 16px",
                borderRadius: "18px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                minWidth: "100px",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>🏠</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>Home</span>
            </button>

            <button
              onClick={() => navigateTo("/history")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "14px 16px",
                borderRadius: "18px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                minWidth: "100px",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>📊</span>
              <span style={{ fontSize: "11px", fontWeight: "600" }}>History</span>
            </button>

            <button
              onClick={logout}
              style={{
                background: "rgba(239,68,68,0.8)",
                padding: "14px 16px",
                borderRadius: "18px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                minWidth: "100px",
                minHeight: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)",
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
        `}
      </style>
    </>
  );
};

export default Navbar;