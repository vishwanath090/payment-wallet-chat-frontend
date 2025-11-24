// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeHover, setActiveHover] = useState(null);
  const [particles, setParticles] = useState([]);

  // Create floating particles for background
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        size: Math.random() * 2 + 1
      });
    }
    setParticles(newParticles);
  }, []);

  const handleLogout = () => {
    // Add a smooth logout animation
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.transform = 'translateY(100%)';
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
    <>
      {/* Add spacing at the bottom of pages to prevent content overlap */}
      <div style={{
        height: '100px', // This creates space at the bottom so content isn't hidden
        width: '100%',
        pointerEvents: 'none'
      }} />
      
      <nav style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '25px',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        zIndex: 1000, // High z-index but content should have lower
        boxShadow: `
          0 25px 50px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'navbarSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        
        {/* Animated Background Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: '-10%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              animation: `particleFloat ${3 + particle.delay}s infinite ease-in-out`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}

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
          <div key={item.path} style={{ position: 'relative' }}>
            {/* Active State Glow Effect */}
            {location.pathname === item.path && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70px',
                height: '70px',
                background: item.color,
                borderRadius: '20px',
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
                padding: '12px 20px',
                borderRadius: '18px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: location.pathname === item.path ? 
                  `linear-gradient(135deg, ${item.color}, rgba(255, 255, 255, 0.1))` : 
                  'transparent',
                minWidth: '70px',
                position: 'relative',
                zIndex: 1,
                border: location.pathname === item.path ? 
                  '1px solid rgba(255, 255, 255, 0.3)' : 
                  '1px solid transparent',
                transform: activeHover === index ? 'translateY(-8px) scale(1.1)' : 
                          location.pathname === item.path ? 'translateY(-2px)' : 'translateY(0)',
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
          width: '1px',
          height: '30px',
          background: 'rgba(255, 255, 255, 0.2)',
          margin: '0 8px',
          borderRadius: '1px'
        }} />

        {/* Enhanced Logout Button */}
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
            padding: '12px 20px',
            borderRadius: '18px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: '70px',
            transform: activeHover === 'logout' ? 'translateY(-8px) scale(1.1)' : 'translateY(0)',
            boxShadow: activeHover === 'logout' ? 
              '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(239, 68, 68, 0.4)' : 
              'none',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={() => setActiveHover('logout')}
          onMouseLeave={() => setActiveHover(null)}
        >
          {/* Button Hover Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.6s ease',
            opacity: activeHover === 'logout' ? 1 : 0
          }} />
          
          <div style={{
            fontSize: '22px',
            marginBottom: '6px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: activeHover === 'logout' ? 'scale(1.3) rotate(10deg)' : 'scale(1)',
            filter: activeHover === 'logout' ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
          }}>
            🚪
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            textShadow: activeHover === 'logout' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
            opacity: activeHover === 'logout' ? 1 : 0.9
          }}>
            Logout
          </span>
        </button>

        <style>
          {`
            @keyframes navbarSlideUp {
              from {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
              }
            }

            @keyframes particleFloat {
              0%, 100% {
                transform: translateY(0px) translateX(0px);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              90% {
                opacity: 1;
              }
              50% {
                transform: translateY(-120px) translateX(10px);
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

            /* Ensure main content has proper spacing */
            .page-content {
              padding-bottom: 120px !important;
              min-height: calc(100vh - 120px);
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
              nav {
                bottom: 15px;
                padding: 6px 12px;
              }
              
              .nav-item {
                padding: 10px 16px;
                min-width: 60px;
              }
              
              .nav-icon {
                font-size: 20px;
              }
              
              .nav-label {
                font-size: 10px;
              }

              /* Adjust spacing for mobile */
              .page-content {
                padding-bottom: 100px !important;
                min-height: calc(100vh - 100px);
              }
            }

            @media (max-width: 360px) {
              nav {
                bottom: 10px;
                padding: 4px 8px;
              }
              
              .nav-item {
                padding: 8px 12px;
                min-width: 55px;
              }
            }
          `}
        </style>
      </nav>
    </>
  );
};

export default Navbar;