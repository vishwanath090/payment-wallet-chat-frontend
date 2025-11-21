import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/users";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredContact, setHoveredContact] = useState(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Filter contacts based on search term
  const filteredContacts = useMemo(() => {
    if (!data) return [];
    
    return data.filter(user => 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Function to get initials from full name
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          animation: 'pulse 2s infinite'
        }}>
          👥
        </div>
        <div style={{
          width: '120px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          margin: '0 auto 20px',
          borderRadius: '1px',
          animation: 'shimmer 2s infinite'
        }} />
        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '14px',
          fontWeight: '500',
          margin: 0,
          letterSpacing: '0.5px'
        }}>
          Loading contacts...
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
        }}>
          ⚠️
        </div>
        <h3 style={{ 
          color: 'rgba(255,255,255,0.95)', 
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          Failed to Load
        </h3>
        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '14px',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          We couldn't load your contacts. Please check your connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.06)';
            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
      padding: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Elements - Matching Dashboard */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        animation: "backgroundShift 15s ease-in-out infinite alternate",
        pointerEvents: "none"
      }} />

      {/* Main Content */}
      <div style={{ 
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        
        {/* Header Section - Matching Dashboard Style */}
        <div style={{ 
          padding: '40px 0 30px',
          background: 'transparent',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              👥
            </div>
            <h1 style={{ 
              marginBottom: '8px', 
              color: 'rgba(255,255,255,0.95)',
              fontSize: '2rem',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Contacts
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: '500',
              margin: 0
            }}>
              {data?.length || 0} contacts • Your network
            </p>
          </div>
        </div>

        {/* Search Section - Matching Dashboard Style */}
        <div style={{
          marginBottom: '24px',
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px 16px 48px',
                borderRadius: '16px',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '15px',
                outline: 'none',
                fontFamily: 'inherit',
                fontWeight: '400'
              }}
            />
            
            {/* Search Icon */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '18px',
              pointerEvents: 'none'
            }}>
              🔍
            </div>
            
            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  width: '28px',
                  height: '28px',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                  e.target.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div style={{
              marginTop: '16px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: '500',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Contacts List - Matching Dashboard Bento Style */}
        <div style={{ 
          flex: 1
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {filteredContacts.map((user) => (
              <div
                key={user.email}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transform: hoveredContact === user.email ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)'
                }}
                onMouseEnter={() => setHoveredContact(user.email)}
                onMouseLeave={() => setHoveredContact(null)}
                onClick={() => navigate('/send-money', { 
                  state: { 
                    contact: {
                      email: user.email,
                      name: user.full_name
                    }
                  }
                })}
              >
                {/* Hover overlay - Matching Dashboard */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                  opacity: hoveredContact === user.email ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: 1
                }} />
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}>
                  
                  {/* Profile Avatar - Matching Dashboard Style */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: '600',
                      fontSize: '14px',
                      marginRight: '16px',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                      transform: hoveredContact === user.email ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    {getInitials(user.full_name)}
                  </div>

                  {/* User Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: '4px',
                      transition: 'all 0.3s ease',
                      transform: hoveredContact === user.email ? 'translateX(4px)' : 'translateX(0)'
                    }}>
                      {user.full_name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      fontWeight: '400',
                      transition: 'all 0.3s ease',
                      transform: hoveredContact === user.email ? 'translateX(4px)' : 'translateX(0)'
                    }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Arrow Icon - Matching Dashboard */}
                  <div style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '16px',
                    marginLeft: '12px',
                    transition: 'all 0.3s ease',
                    transform: hoveredContact === user.email ? 'translateX(4px) scale(1.2)' : 'translateX(0) scale(1)'
                  }}>
                    →
                  </div>
                </div>

                {/* Ripple effect on hover - Matching Dashboard */}
                {hoveredContact === user.email && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    animation: 'ripple 0.6s ease-out',
                    zIndex: 1
                  }} />
                )}
              </div>
            ))}

            {/* Empty States - Matching Dashboard Style */}
            {filteredContacts.length === 0 && searchTerm && (
              <div style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  opacity: 0.5
                }}>
                  🔍
                </div>
                <h3 style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  No matches found
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0
                }}>
                  Try searching with different terms
                </p>
              </div>
            )}

            {data.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  opacity: 0.5
                }}>
                  👥
                </div>
                <h3 style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  No contacts yet
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0
                }}>
                  Your contacts will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.03); opacity: 0.9; }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }

          @keyframes backgroundShift {
            0% { transform: translateX(-2%) translateY(-2%) scale(1); }
            100% { transform: translateX(2%) translateY(2%) scale(1.05); }
          }

          @keyframes ripple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
          }

          input::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }
        `}
      </style>
    </div>
  );
};

export default Contacts;