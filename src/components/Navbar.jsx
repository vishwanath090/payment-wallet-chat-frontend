// components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeHover, setActiveHover] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navbarRef = useRef(null);

  // Initialize position to center top of the page
  useEffect(() => {
    const savedPosition = localStorage.getItem('navbarPosition');
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      setPosition({ x, y });
    } else {
      // Default position: centered at top
      const navbarWidth = 94; // Approximate width of navbar
      const x = (window.innerWidth - navbarWidth) / 2;
      const y = 20; // 20px from top
      setPosition({ x, y });
    }
  }, []);

  // Mouse events for desktop
  const handleMouseDown = (e) => {
    // Only start dragging if clicking on the drag handle specifically
    const isDragHandle = e.target.classList.contains('drag-handle');
    
    if (isDragHandle) {
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
      // Save position to localStorage
      localStorage.setItem('navbarPosition', JSON.stringify(position));
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const isDragHandle = e.target.classList.contains('drag-handle');
    
    if (isDragHandle) {
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
      // Save position to localStorage
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
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';
    } else {
      // Mouse events
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.touchAction = '';
    }

    return () => {
      // Cleanup mouse events
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Cleanup touch events
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging, dragStart]);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.opacity = '0';
      navbar.style.transform = `scale(0.8)`;
    }
    
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 300);
  };

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home', color: 'rgba(139, 92, 246, 0.3)' },
    { path: '/history', icon: '📊', label: 'History', color: 'rgba(59, 130, 246, 0.3)' },
  ];

  return (
    <nav 
      ref={navbarRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 12px',
        zIndex: 1000,
        boxShadow: `
          0 25px 50px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        transition: isDragging ? 'none' : 'all 0.3s ease',
        animation: 'navbarSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        cursor: 'default',
        touchAction: 'none', // Important for mobile dragging
      }}
    >
      
      {/* Drag Handle Indicator - Works on both desktop and mobile */}
      <div 
        className="drag-handle"
        style={{
          position: 'absolute',
          top: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '30px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '2px',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: 'all 0.3s ease',
          zIndex: 10,
          touchAction: 'none', // Important for mobile
        }} 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.6)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.4)'}
      />

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

      {/* Dragging Overlay */}
      {isDragging && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '25px',
          zIndex: -1
        }} />
      )}

      {navItems.map((item, index) => (
        <div key={item.path} style={{ position: 'relative', marginBottom: '16px' }}>
          {/* Active State Glow Effect */}
          {location.pathname === item.path && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              background: item.color,
              borderRadius: '18px',
              filter: 'blur(15px)',
              opacity: isDragging ? 0.3 : 0.6,
              animation: isDragging ? 'none' : 'pulseGlow 2s infinite',
              zIndex: -1
            }} />
          )}

          <Link
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.8)',
              padding: '16px 12px',
              borderRadius: '18px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              background: location.pathname === item.path ? 
                `linear-gradient(135deg, ${item.color}, rgba(255, 255, 255, 0.1))` : 
                'transparent',
              minHeight: '70px',
              minWidth: '70px',
              position: 'relative',
              zIndex: 1,
              border: location.pathname === item.path ? 
                '1px solid rgba(255, 255, 255, 0.3)' : 
                '1px solid transparent',
              transform: activeHover === index ? 'scale(1.1)' : 'scale(1)',
              boxShadow: location.pathname === item.path ? 
                `0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${item.color.replace('0.3', '0.4')}` :
                activeHover === index ? 
                `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px ${item.color.replace('0.3', '0.3')}` :
                'none',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent', // Remove mobile tap highlight
            }}
            onMouseEnter={() => setActiveHover(index)}
            onMouseLeave={() => setActiveHover(null)}
          >
            <div style={{
              fontSize: '22px',
              marginBottom: '6px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: location.pathname === item.path ? 'scale(1.3) rotate(5deg)' : 
                         activeHover === index ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
              filter: location.pathname === item.path ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              textShadow: location.pathname === item.path ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
              opacity: (activeHover === index || location.pathname === item.path) ? 1 : 0.9
            }}>
              {item.label}
            </span>
          </Link>
        </div>
      ))}
      
      {/* Separator */}
      <div style={{
        width: '30px',
        height: '1px',
        background: 'rgba(255, 255, 255, 0.2)',
        margin: '8px 0 16px 0',
        borderRadius: '1px',
        opacity: isDragging ? 0.5 : 1
      }} />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: activeHover === 'logout' ? 
            'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))' : 
            'transparent',
          border: activeHover === 'logout' ? 
            '1px solid rgba(239, 68, 68, 0.4)' : 
            '1px solid transparent',
          color: activeHover === 'logout' ? 'white' : 'rgba(255, 255, 255, 0.8)',
          padding: '16px 12px',
          borderRadius: '18px',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '70px',
          minWidth: '70px',
          transform: activeHover === 'logout' ? 'scale(1.1)' : 'scale(1)',
          boxShadow: activeHover === 'logout' ? 
            '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(239, 68, 68, 0.4)' : 
            'none',
          WebkitTapHighlightColor: 'transparent', // Remove mobile tap highlight
        }}
        onMouseEnter={() => setActiveHover('logout')}
        onMouseLeave={() => setActiveHover(null)}
      >
        <div style={{
          fontSize: '22px',
          marginBottom: '6px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: activeHover === 'logout' ? 'scale(1.3) rotate(10deg)' : 'scale(1)'
        }}>
          🚪
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.5px'
        }}>
          Logout
        </span>
      </button>

      <style>
        {`
          @keyframes navbarSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.6;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.05);
            }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            nav {
              padding: 16px 8px;
              transform: scale(0.9); /* Slightly smaller on mobile */
              transform-origin: center;
            }
            
            .drag-handle {
              width: 40px; /* Larger touch target on mobile */
              height: 6px;
            }
          }

          @media (max-width: 480px) {
            nav {
              padding: 14px 6px;
              transform: scale(0.85);
            }
          }

          /* Prevent text selection during drag */
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          /* Allow text selection in inputs if needed */
          input, textarea {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;