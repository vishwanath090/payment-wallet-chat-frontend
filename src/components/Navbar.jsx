// components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  /* ------------------------------
      FORCE POSITION FUNCTION
  ------------------------------ */
  const forcePosition = (pos) => {
    const el = navRef.current;
    if (!el) return;

    el.style.position = "fixed";
    el.style.zIndex = "999999";
    el.style.transition = "all 0.35s ease";

    // Clear old
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
    } else if (pos === "top-left") {
      el.style.top = "20px";
      el.style.left = "20px";
    }
  };

  /* ------------------------------
      AUTO POSITION ON ROUTE CHANGE
  ------------------------------ */
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      forcePosition("bottom-center");
    } else {
      forcePosition("top-right");
    }
  }, [location.pathname]);

  /* ------------------------------
      DRAG LOGIC
  ------------------------------ */

  const startDrag = (x) => {
    setIsDragging(true);
    setDragStart({ x });
  };

  const handleMouseDown = (e) => {
    if (!e.target.closest("button")) startDrag(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;

    if (dx > 50) forcePosition("top-right");
    if (dx < -50) forcePosition("top-left");
  };

  const endDrag = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", endDrag);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", endDrag);
    }
  }, [isDragging]);

  /* ------------------------------
      UI
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
            inset: 0,
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
        style={{
          background: "rgba(255,255,255,0.15)",
          padding: "16px 20px",
          borderRadius: "25px",
          display: "flex",
          gap: "12px",
          backdropFilter: "blur(20px)",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
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
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {isOpen && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigateTo("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "12px 16px",
                borderRadius: "14px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              🏠 Home
            </button>

            <button
              onClick={() => navigateTo("/history")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "12px 16px",
                borderRadius: "14px",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              📊 History
            </button>

            <button
              onClick={logout}
              style={{
                background: "rgba(239,68,68,0.8)",
                padding: "12px 16px",
                borderRadius: "14px",
                color: "white",
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
