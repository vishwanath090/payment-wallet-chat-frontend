// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeHover, setActiveHover] = useState(null);

  const handleLogout = () => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.transform = 'translateX(-100%)';
      navbar.style.opacity = '0';
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
    <nav style={{
      position: 'fixed',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
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
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'navbarSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
      
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
              opacity: 0.6,
              animation: 'pulseGlow 2s infinite',
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
              transform: activeHover === index ? 'translateX(5px) scale(1.1)' : 
                        location.pathname === item.path ? 'translateX(2px)' : 'translateX(0)',
              boxShadow: location.pathname === item.path ? 
                `0 15px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${item.color.replace('0.3', '0.4')}` :
                activeHover === index ? 
                `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px ${item.color.replace('0.3', '0.3')}` :
                'none'
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
              opacity: activeHover === index || location.pathname === item.path ? 1 : 0.9
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
        borderRadius: '1px'
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
          transform: activeHover === 'logout' ? 'translateX(5px) scale(1.1)' : 'translateX(0)',
          boxShadow: activeHover === 'logout' ? 
            '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(239, 68, 68, 0.4)' : 
            'none'
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
              transform: translateY(-50%) translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(-50%) translateX(0);
              opacity: 1;
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

          @media (max-width: 768px) {
            nav {
              left: 10px;
              padding: 16px 8px;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;