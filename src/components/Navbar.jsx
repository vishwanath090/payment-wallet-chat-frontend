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
  const [position, setPosition] = useState('bottom-center');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navbarRef = useRef(null);

  // Initialize position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('navbarPosition');
    if (savedPosition) {
      setPosition(savedPosition);
    }
  }, []);

  // Update position when preference changes
  useEffect(() => {
    localStorage.setItem('navbarPosition', position);
  }, [position]);

  // Mouse events for desktop dragging
  const handleMouseDown = (e) => {
    // Allow dragging from anywhere on the navbar except buttons
    if (!e.target.closest('button') && !e.target.closest('a')) {
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
    const deltaY = e.clientY - dragStart.y;

    // Determine new position based on drag direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal drag - change position
      if (deltaX > 50) {
        setPosition('bottom-right');
        setIsDragging(false);
      } else if (deltaX < -50) {
        setPosition('bottom-left');
        setIsDragging(false);
      }
    } else {
      // Vertical drag - could be used for other actions
      if (deltaY < -30 && !isOpen) {
        setIsOpen(true); // Swipe up to open menu
        setIsDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile dragging
  const handleTouchStart = (e) => {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      setIsDragging(true);
      const touch = e.touches[0];
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
    const deltaY = touch.clientY - dragStart.y;

    // Determine new position based on drag direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal drag - change position
      if (deltaX > 60) {
        setPosition('bottom-right');
        setIsDragging(false);
      } else if (deltaX < -60) {
        setPosition('bottom-left');
        setIsDragging(false);
      }
    } else {
      // Vertical drag - swipe up to open menu
      if (deltaY < -40 && !isOpen) {
        setIsOpen(true);
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
    { path: '/dashboard', icon: '🏠', label: 'Home', color: 'rgba(139, 92, 246, 0.9)' },
    { path: '/history', icon: '📊', label: 'History', color: 'rgba(59, 130, 246, 0.9)' },
    { path: '/add-money', icon: '💰', label: 'Add Money', color: 'rgba(16, 185, 129, 0.9)' },
    { path: '/send-money', icon: '💸', label: 'Send Money', color: 'rgba(245, 158, 11, 0.9)' },
    { path: '/contacts', icon: '👥', label: 'Contacts', color: 'rgba(168, 85, 247, 0.9)' },
    { path: '/settings', icon: '⚙️', label: 'Settings', color: 'rgba(107, 114, 128, 0.9)' },
  ];

  const handleNavClick = (path) => {
    if (path === 'logout') {
      handleLogout();
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const getNavbarStyle = () => {
    const baseStyle = {
      position: 'fixed',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '25px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '16px 20px',
      zIndex: 1000,
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      gap: '12px',
      cursor: isDragging ? 'grabbing' : 'grab',
      minHeight: '70px',
      touchAction: 'none',
    };

    switch (position) {
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: '25px',
          left: '25px',
          right: 'auto',
        };
      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: '25px',
          right: '25px',
          left: 'auto',
        };
      case 'bottom-center':
      default:
        return {
          ...baseStyle,
          bottom: '25px',
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        };
    }
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
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Drag Instruction Tooltip */}
      {!isOpen && (
        <div style={{
          position: 'fixed',
          bottom: position === 'bottom-center' ? '100px' : '90px',
          left: position === 'bottom-left' ? '25px' : position === 'bottom-right' ? 'auto' : '50%',
          right: position === 'bottom-right' ? '25px' : 'auto',
          transform: position === 'bottom-center' ? 'translateX(-50%)' : 'none',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          zIndex: 999,
          animation: 'fadeInOut 3s ease-in-out',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          🢂 Drag left/right to move • Swipe up to open
        </div>
      )}
      
      <nav 
        ref={navbarRef}
        style={getNavbarStyle()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        
        {/* Main Menu Button - Larger and more accessible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9))',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '24px',
            color: 'white',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(90deg) scale(1.1)' : 'rotate(0) scale(1)',
            boxShadow: isOpen 
              ? '0 12px 25px rgba(139, 92, 246, 0.6)' 
              : '0 8px 20px rgba(139, 92, 246, 0.4)',
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Position Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '12px',
          color: 'white',
          fontWeight: '600',
          minWidth: '80px',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ 
            fontSize: '14px',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
          }}>
            {position === 'bottom-left' ? '↙️' : 
             position === 'bottom-right' ? '↘️' : '⬇️'}
          </span>
          <span style={{ 
            textTransform: 'capitalize',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            {position.replace('bottom-', '')}
          </span>
        </div>

        {/* Expanded Menu Items */}
        {isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideInRight 0.3s ease',
            flexWrap: 'wrap',
            maxWidth: '500px',
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
                    `linear-gradient(135deg, ${item.color}, rgba(255, 255, 255, 0.3))` : 
                    'rgba(255, 255, 255, 0.1)',
                  border: location.pathname === item.path ? 
                    '1px solid rgba(255, 255, 255, 0.5)' : 
                    '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '14px 16px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '80px',
                  minHeight: '70px',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = `linear-gradient(135deg, ${item.color.replace('0.9', '0.4')}, rgba(255, 255, 255, 0.2))`;
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <div style={{
                  fontSize: '22px',
                  marginBottom: '6px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  transition: 'all 0.2s ease',
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.3px',
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
                padding: '14px 16px',
                borderRadius: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '80px',
                minHeight: '70px',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.8)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{
                fontSize: '22px',
                marginBottom: '6px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}>
                🚪
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.3px',
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
                transform: translateX(-10px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes fadeInOut {
              0%, 100% { opacity: 0; transform: translateY(10px); }
              10%, 90% { opacity: 1; transform: translateY(0); }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
              nav {
                padding: 14px 16px;
                max-width: 95vw;
                min-height: 75px;
              }
              
              /* Stack menu items vertically on mobile */
              nav > div:last-child {
                flex-direction: column;
                max-height: 60vh;
                overflow-y: auto;
              }
              
              button {
                min-width: 130px;
                min-height: 65px;
              }
            }

            @media (max-width: 480px) {
              nav {
                padding: 12px 14px;
                min-height: 70px;
              }
              
              button {
                min-width: 120px;
                min-height: 60px;
                padding: 12px 14px;
              }
              
              .drag-tooltip {
                font-size: 11px;
                padding: 6px 10px;
              }
            }

            /* Custom scrollbar for mobile */
            nav > div:last-child::-webkit-scrollbar {
              width: 4px;
            }

            nav > div:last-child::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 2px;
            }

            nav > div:last-child::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 2px;
            }
          `}
        </style>
      </nav>
    </>
  );
};

export default Navbar;