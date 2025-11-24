// components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState('bottom-center'); // 'bottom-center', 'bottom-left', 'bottom-right'
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
      padding: '12px 16px',
      zIndex: 1000,
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      gap: '8px',
    };

    switch (position) {
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: '20px',
          left: '20px',
          right: 'auto',
        };
      case 'bottom-right':
        return {
          ...baseStyle,
          bottom: '20px',
          right: '20px',
          left: 'auto',
        };
      case 'bottom-center':
      default:
        return {
          ...baseStyle,
          bottom: '20px',
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
      
      <nav 
        ref={navbarRef}
        style={getNavbarStyle()}
      >
        
        {/* Main Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(59, 130, 246, 0.9))',
            border: 'none',
            borderRadius: '50%',
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '22px',
            color: 'white',
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(90deg) scale(1.1)' : 'rotate(0) scale(1)',
            boxShadow: isOpen 
              ? '0 12px 25px rgba(139, 92, 246, 0.6)' 
              : '0 8px 20px rgba(139, 92, 246, 0.4)',
            flexShrink: 0,
          }}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Position Selector */}
        {isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginRight: '12px',
            paddingRight: '12px',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            {[
              { pos: 'bottom-left', icon: '↙️', label: 'Left' },
              { pos: 'bottom-center', icon: '⬇️', label: 'Center' },
              { pos: 'bottom-right', icon: '↘️', label: 'Right' },
            ].map((posOption) => (
              <button
                key={posOption.pos}
                onClick={() => setPosition(posOption.pos)}
                style={{
                  background: position === posOption.pos 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: position === posOption.pos 
                    ? '1px solid rgba(255, 255, 255, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'white',
                  transition: 'all 0.2s ease',
                }}
                title={`Position: ${posOption.label}`}
              >
                {posOption.icon}
              </button>
            ))}
          </div>
        )}

        {/* Expanded Menu Items */}
        {isOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
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
                  padding: '12px 14px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '75px',
                  minHeight: '65px',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = `linear-gradient(135deg, ${item.color.replace('0.9', '0.4')}, rgba(255, 255, 255, 0.2))`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{
                  fontSize: '20px',
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
                padding: '12px 14px',
                borderRadius: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '75px',
                minHeight: '65px',
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
                fontSize: '20px',
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

            /* Mobile responsiveness */
            @media (max-width: 768px) {
              nav {
                padding: 10px 12px;
                max-width: 95vw;
              }
              
              /* Stack menu items vertically on mobile */
              nav > div:last-child {
                flex-direction: column;
                max-height: 60vh;
                overflow-y: auto;
              }
              
              button {
                min-width: 120px;
                min-height: 55px;
              }
              
              .position-selector {
                flex-direction: row !important;
                border-right: none !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                margin-right: 0 !important;
                margin-bottom: 8px;
                padding-right: 0 !important;
                padding-bottom: 8px;
              }
            }

            @media (max-width: 480px) {
              nav {
                padding: 8px 10px;
              }
              
              button {
                min-width: 110px;
                min-height: 50px;
                padding: 10px 12px;
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