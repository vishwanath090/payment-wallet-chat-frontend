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

  // Save updated position
  useEffect(() => {
    localStorage.setItem("navbarPosition", position);
  }, [position]);

  // Auto reposition rule (dashboard => bottom-center, others => top-right)
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setPosition("bottom-center");
    } else {
      setPosition("top-right");
    }

    // Force inline style override after a tiny delay (ensures style isn't immediately overwritten)
    // This guarantees the navbar visually moves even if CSS elsewhere is stronger.
    setTimeout(() => {
      if (!navbarRef.current) return;
      const el = navbarRef.current;

      // Clear any conflicting positioning first
      el.style.bottom = "";
      el.style.left = "";
      el.style.right = "";
      el.style.top = "";
      el.style.transform = "";

      // Apply forced position depending on computed position
      if (location.pathname === "/dashboard") {
        el.style.bottom = "25px";
        el.style.left = "50%";
        el.style.transform = "translateX(-50%)";
      } else {
        el.style.top = "20px";
        el.style.right = "20px";
      }
    }, 10);
  }, [location.pathname]);

  // MOUSE drag logic
  const handleMouseDown = (e) => {
    // allow clicks on buttons to work; only start drag when not clicking a button
    if (!e.target.closest("button")) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      // ensure pointer capture style
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;

    // horizontal drag to snap left/right
    if (deltaX > 60) {
      setPosition("top-right");
      // force inline right position immediately
      if (navbarRef.current) {
        navbarRef.current.style.top = "20px";
        navbarRef.current.style.right = "20px";
        navbarRef.current.style.left = "";
        navbarRef.current.style.bottom = "";
        navbarRef.current.style.transform = "";
      }
      setIsDragging(false);
    } else if (deltaX < -60) {
      setPosition("top-left");
      if (navbarRef.current) {
        navbarRef.current.style.top = "20px";
        navbarRef.current.style.left = "20px";
        navbarRef.current.style.right = "";
        navbarRef.current.style.bottom = "";
        navbarRef.current.style.transform = "";
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  // TOUCH drag logic
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

    if (deltaX > 60) {
      setPosition("top-right");
      if (navbarRef.current) {
        navbarRef.current.style.top = "20px";
        navbarRef.current.style.right = "20px";
        navbarRef.current.style.left = "";
        navbarRef.current.style.bottom = "";
        navbarRef.current.style.transform = "";
      }
      setIsDragging(false);
    } else if (deltaX < -60) {
      setPosition("top-left");
      if (navbarRef.current) {
        navbarRef.current.style.top = "20px";
        navbarRef.current.style.left = "20px";
        navbarRef.current.style.right = "";
        navbarRef.current.style.bottom = "";
        navbarRef.current.style.transform = "";
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Attach / detach global listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragStart]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Only Home & History (and Logout)
  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/history", icon: "📊", label: "History" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // styles based on logical state (transition handled here)
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
      transition: "all 0.35s ease",
      // ensure pointer interactions work on mobile
      touchAction: "none",
    };

    switch (position) {
      case "top-left":
        return { ...base, top: "20px", left: "20px", right: "", bottom: "", transform: "" };
      case "top-right":
        return { ...base, top: "20px", right: "20px", left: "", bottom: "", transform: "" };
      case "bottom-center":
      default:
        return { ...base, bottom: "25px", left: "50%", transform: "translateX(-50%)", top: "", right: "" };
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
