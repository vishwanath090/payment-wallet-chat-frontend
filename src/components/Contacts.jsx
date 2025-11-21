// src/components/Contacts.jsx
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/users";

const Contacts = ({ onContactSelect, showChatButton = false }) => {
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
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Function to generate consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return '#64748b';
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7DC6F',
      '#DDA0DD', '#98D8C8', '#FFA726', '#BB8FCE', '#85C1E9',
      '#82C0CC', '#489FB5', '#16697A', '#FFA62B', '#3DCCC7'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (isLoading) return (
    <div style={{ 
      padding: 24, 
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{
        width: 50,
        height: 50,
        border: '3px solid rgba(99, 102, 241, 0.3)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: 16
      }}></div>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Loading contacts...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ 
      padding: 24, 
      textAlign: 'center'
    }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>😞</div>
        <p style={{ color: '#f87171', fontSize: '1.1rem', marginBottom: 16 }}>
          Failed to load contacts
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 8,
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search Bar */}
      <div style={{
        marginBottom: 24,
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="Search contacts by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px 16px 48px',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            color: '#f1f5f9',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            fontFamily: 'inherit'
          }}
        />
        
        {/* Search Icon */}
        <div style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b',
          fontSize: '20px',
          pointerEvents: 'none'
        }}>
          🔍
        </div>
      </div>

      {/* Contacts List */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {filteredContacts.map((user, index) => (
          <div
            key={user.email}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: index === filteredContacts.length - 1 ? 'none' : '1px solid rgba(148, 163, 184, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: hoveredContact === user.email ? 'rgba(51, 65, 85, 0.6)' : 'transparent',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={() => setHoveredContact(user.email)}
            onMouseLeave={() => setHoveredContact(null)}
            onClick={() => onContactSelect && onContactSelect(user)}
          >
            {/* Profile Avatar */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: getAvatarColor(user.full_name),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                marginRight: 20,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {getInitials(user.full_name)}
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#f8fafc',
                marginBottom: 6,
              }}>
                {user.full_name}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#94a3b8',
                fontWeight: '500',
              }}>
                {user.email}
              </div>
            </div>

            {/* Chat Button or Arrow */}
            <div style={{
              color: hoveredContact === user.email ? '#6366f1' : '#64748b',
              fontSize: '20px',
              marginLeft: 12,
              transition: 'all 0.3s ease',
            }}>
              {showChatButton ? (
                <button
                  style={{
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Chat
                </button>
              ) : (
                '→'
              )}
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && searchTerm && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            color: '#64748b',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            No contacts found for "{searchTerm}"
          </div>
        )}

        {data.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            color: '#64748b',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>👥</div>
            No contacts available
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Contacts;