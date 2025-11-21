// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/users";
import { getChatHistory } from "../api/chat";
import { useLocation, useNavigate } from "react-router-dom";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [websocket, setWebsocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredContact, setHoveredContact] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")); 
  console.log("👤 Current user:", currentUser);
  const location = useLocation();
  const navigate = useNavigate();

  // Get all users using your existing API
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Filter contacts based on search term
  const filteredContacts = users.filter(user => 
    user.id !== currentUser?.id && (
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // WebSocket connection for real-time chat
  useEffect(() => {
    if (!currentUser?.email) {
      console.log("❌ No user email available for WebSocket connection");
      setConnectionStatus("no_user");
      return;
    }

    console.log("🔗 Starting WebSocket connection for user:", currentUser.email);
    setConnectionStatus("connecting");

    // Clean up any existing connection
    if (websocket) {
      websocket.close();
    }

    try {
      const ws = new WebSocket(`ws://localhost:8000/api/v1/chat/ws/${encodeURIComponent(currentUser.email)}`);
      
      ws.onopen = () => {
        console.log("✅ WebSocket Connected successfully");
        setConnectionStatus("connected");
      };

      ws.onmessage = (event) => {
        console.log("📨 Received WebSocket message:", event.data);
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("🔴 WebSocket Disconnected");
        setConnectionStatus("disconnected");
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
        setConnectionStatus("error");
      };

      setWebsocket(ws);

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "Component unmounting");
        }
      };
    } catch (error) {
      console.error("❌ Failed to create WebSocket:", error);
      setConnectionStatus("error");
    }
  }, [currentUser?.email]);

  // Load chat history when user is selected
  useEffect(() => {
    if (selectedUser) {
      console.log("📖 Loading chat history with:", selectedUser.email);
      const receiverIdentifier = selectedUser.email;
      getChatHistory(receiverIdentifier)
        .then(history => {
          console.log("📚 Chat history loaded:", history);
          setMessages(Array.isArray(history) ? history : []);
        })
        .catch(error => {
          console.error("❌ Error loading chat history:", error);
          setMessages([]);
        });
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message function
  const sendMessage = () => {
    if (!newMessage.trim()) {
      console.log("❌ No message to send");
      return;
    }
    
    if (!selectedUser) {
      console.log("❌ No user selected");
      return;
    }
    
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      console.log("❌ WebSocket not connected. ReadyState:", websocket?.readyState);
      return;
    }

    const messageData = {
      receiver_identifier: selectedUser.email,
      content: newMessage.trim(),
      type: "text"
    };

    console.log("📤 Sending message:", messageData);

    try {
      websocket.send(JSON.stringify(messageData));
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  // Send message on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper functions
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return '#64748b';
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7DC6F', '#DDA0DD'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '--:--';
    }
  };

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected": return { text: "Connected", color: "#10B981" };
      case "connecting": return { text: "Connecting...", color: "#F59E0B" };
      case "disconnected": return { text: "Disconnected", color: "#EF4444" };
      case "error": return { text: "Connection Error", color: "#EF4444" };
      case "no_user": return { text: "Not Logged In", color: "#EF4444" };
      default: return { text: "Unknown", color: "#64748B" };
    }
  };

  const connectionInfo = getConnectionStatus();

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
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
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginLeft: '16px' }}>Loading contacts...</p>
        
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
  }
  
  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>😞</div>
          <div style={{ fontSize: "18px", marginBottom: "8px" }}>Failed to load contacts</div>
          <div style={{ fontSize: "14px", color: "#94a3b8" }}>Please try again later</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      minHeight: "100vh",
      color: "white",
      display: "flex"
    }}>
      
      {/* Left Sidebar - Contacts List */}
      <div style={{
        width: "400px",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(15, 23, 42, 0.8)",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(30, 41, 59, 0.8)"
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: "24px", 
            fontWeight: "700",
            background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Messages
          </h2>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
            fontSize: "14px",
            color: connectionInfo.color
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: connectionInfo.color
            }} />
            {connectionInfo.text}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(30, 41, 59, 0.8)",
                color: "white",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.3s ease"
              }}
            />
            <div style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              fontSize: "16px"
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((user, index) => (
              <div
                key={user.email}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px 24px",
                  borderBottom: index === filteredContacts.length - 1 ? 'none' : '1px solid rgba(148, 163, 184, 0.1)',
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: selectedUser?.id === user.id 
                    ? "rgba(99, 102, 241, 0.2)" 
                    : hoveredContact === user.email 
                      ? "rgba(51, 65, 85, 0.6)" 
                      : "transparent",
                  borderLeft: selectedUser?.id === user.id ? "4px solid #6366f1" : "4px solid transparent",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={() => setHoveredContact(user.email)}
                onMouseLeave={() => setHoveredContact(null)}
                onClick={() => {
                  console.log("💬 Chat contact selected:", user);
                  setSelectedUser(user);
                  // push navigation state so other pages (e.g. Contacts) can deep-link to this chat
                  try {
                    navigate('/chat', { state: { contact: { email: user.email, name: user.full_name } }, replace: true });
                  } catch (e) {
                    console.warn('Navigation not available:', e);
                  }
                }}
              >
                {/* Profile Avatar */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: getAvatarColor(user.full_name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginRight: 20,
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    position: "relative",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                    transform: hoveredContact === user.email ? "scale(1.1)" : "scale(1)"
                  }}
                >
                  {getInitials(user.full_name)}
                </div>

                {/* User Info */}
                <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                  <div style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#f8fafc",
                    marginBottom: 6,
                    transition: "all 0.3s ease",
                    transform: hoveredContact === user.email ? "translateX(4px)" : "translateX(0)"
                  }}>
                    {user.full_name}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    transform: hoveredContact === user.email ? "translateX(4px)" : "translateX(0)"
                  }}>
                    {user.email}
                  </div>
                </div>

                {/* Chat Icon */}
                <div style={{
                  color: selectedUser?.id === user.id ? "#6366f1" : "#64748b",
                  fontSize: "20px",
                  marginLeft: 12,
                  transition: "all 0.3s ease",
                  position: "relative",
                  zIndex: 1,
                  transform: hoveredContact === user.email ? "translateX(4px) scale(1.2)" : "translateX(0) scale(1)"
                }}>
                  💬
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#64748b"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
              <div style={{ fontSize: "16px" }}>
                {searchTerm ? "No contacts found" : "No contacts available"}
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Right Side - Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(30, 41, 59, 0.8)",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: getAvatarColor(selectedUser.full_name),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "16px"
                }}
              >
                {getInitials(selectedUser.full_name)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#f8fafc"
                }}>
                  {selectedUser.full_name || "Unknown User"}
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "#94a3b8"
                }}>
                  {selectedUser.email || "No email"}
                </div>
              </div>

              <div style={{
                fontSize: "14px",
                color: connectionInfo.color,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: connectionInfo.color
                }} />
                {connectionInfo.text}
              </div>
            </div>

            {/* Messages Container */}
            <div style={{
              flex: 1,
              padding: "24px",
              overflow: "auto",
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%)"
            }}>
              {messages.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  color: "#64748b",
                  padding: "60px 20px"
                }}>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
                  <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                    No messages yet
                  </div>
                  <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                    Start a conversation with {selectedUser.full_name || "this user"}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    style={{
                      display: "flex",
                      justifyContent: message.sender_id === currentUser.id ? "flex-end" : "flex-start",
                      marginBottom: "16px"
                    }}
                  >
                    <div style={{
                      maxWidth: "70%",
                      background: message.sender_id === currentUser.id 
                        ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                        : "rgba(255,255,255,0.1)",
                      padding: "12px 16px",
                      borderRadius: "18px",
                      borderBottomRightRadius: message.sender_id === currentUser.id ? "4px" : "18px",
                      borderBottomLeftRadius: message.sender_id === currentUser.id ? "18px" : "4px"
                    }}>
                      <div style={{ 
                        color: "white", 
                        fontSize: "15px",
                        lineHeight: "1.4",
                        marginBottom: "4px"
                      }}>
                        {message.content}
                      </div>
                      <div style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.6)",
                        textAlign: message.sender_id === currentUser.id ? "right" : "left"
                      }}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
              padding: "20px 24px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(30, 41, 59, 0.8)"
            }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                    style={{
                      width: "100%",
                      padding: "16px 52px 16px 16px",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(15, 23, 42, 0.8)",
                      color: "white",
                      fontSize: "15px",
                      outline: "none",
                      resize: "none",
                      minHeight: "52px",
                      maxHeight: "120px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || connectionStatus !== "connected"}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: newMessage.trim() && connectionStatus === "connected"
                      ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                      : "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "white",
                    cursor: newMessage.trim() && connectionStatus === "connected" ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    transition: "all 0.3s ease"
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            color: "#64748b"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "80px", marginBottom: "24px" }}>💭</div>
              <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                Select a conversation
              </div>
              <div style={{ fontSize: "14px" }}>
                Choose a contact from the sidebar to start chatting
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;