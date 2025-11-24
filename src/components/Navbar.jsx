// components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navbarRef = useRef(null);

  // Initialize position to center bottom of the page
  useEffect(() => {
    const savedPosition = localStorage.getItem('navbarPosition');
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      setPosition({ x, y });
    } else {
      // Default position: centered at bottom
      const navbarWidth = 60; // Width of collapsed navbar
      const x = (window.innerWidth - navbarWidth) / 2;
      const y = window.innerHeight - 80; // 80px from bottom
      setPosition({ x, y });
    }
  }, []);

  // Mouse events for desktop
  const handleMouseDown = (e) => {
    // Only start dragging if clicking on the navbar background
    const isNavbar = e.target === navbarRef.current || 
                     e.target.closest('nav') === navbarRef.current;
    
    if (isNavbar) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const x = e.clientX - dragStart.x;
    const y = e.clientY - dragStart.y;

    updatePosition(x, y);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('navbarPosition', JSON.stringify(position));
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const isNavbar = e.target === navbarRef.current || 
                     e.target.closest('nav') === navbarRef.current;
    
    if (isNavbar) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const x = touch.clientX - dragStart.x;
    const y = touch.clientY - dragStart.y;

    updatePosition(x, y);
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('navbarPosition', JSON.stringify(position));
    }
  };

  // Common position update function
  const updatePosition = (x, y) => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const rect = navbar.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 10;
    const maxY = window.innerHeight - rect.height - 10;
    const boundedX = Math.max(10, Math.min(x, maxX));
    const boundedY = Math.max(10, Math.min(y, maxY));

    setPosition({ x: boundedX, y: boundedY });
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragStart]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home', color: 'rgba(139, 92, 246, 0.8)' },
    { path: '/history', icon: '📊', label: 'History', color: 'rgba(59, 130, 246, 0.8)' },
    { path: '/settings', icon: '⚙️', label: 'Settings', color: 'rgba(16, 185, 129, 0.8)' },
  ];

  const handleNavClick = (path) => {
    if (path === 'logout') {
      handleLogout();
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)',
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <nav 
        ref={navbarRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '25px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '12px 16px',
          zIndex: 1000,
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          transition: isDragging ? 'none' : 'all 0.3s ease',
          cursor: isDragging ? 'grabbing' : 'grab',
          gap: '8px',
          minWidth: '60px',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        
        {/* Main Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9))',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'white',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
            flexShrink: 0,
          }}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Expanded Menu Items */}
        {isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideInRight 0.3s ease',
          }}>
            {navItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: location.pathname === item.path ? 
                    `linear-gradient(135deg, ${item.color}, rgba(255, 255, 255, 0.2))` : 
                    'rgba(255, 255, 255, 0.1)',
                  border: location.pathname === item.path ? 
                    '1px solid rgba(255, 255, 255, 0.4)' : 
                    '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '80px',
                  minHeight: '60px',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{
                  fontSize: '20px',
                  marginBottom: '4px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                  {item.label}
                </span>
              </button>
            ))}
            
            {/* Logout Button */}
            <button
              onClick={() => handleNavClick('logout')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(239, 68, 68, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '80px',
                minHeight: '60px',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{
                fontSize: '20px',
                marginBottom: '4px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}>
                🚪
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}>
                Logout
              </span>
            </button>
          </div>
        )}

        {/* Glass Morphism Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              rgba(255, 255, 255, 0.1) 100%
            )
          `,
          borderRadius: '25px',
          zIndex: -1
        }} />

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

            /* Mobile responsiveness */
            @media (max-width: 768px) {
              nav {
                padding: 10px 12px;
                transform: scale(0.95);
              }
              
              button {
                min-width: 70px;
                min-height: 55px;
              }
            }

            @media (max-width: 480px) {
              nav {
                padding: 8px 10px;
                transform: scale(0.9);
              }
              
              button {
                min-width: 65px;
                min-height: 50px;
                padding: 10px 12px;
              }
            }
          `}
        </style>
      </nav>
    </>
  );
};

export default Navbar;