// src/components/Chat.jsx - IMPROVED WITH WHATSAPP FEATURES
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatUsers, getChatHistory } from "../api/chat";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Track online users
  const [typingUsers, setTypingUsers] = useState(new Set()); // Track typing users
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const queryClient = useQueryClient();
  
  const { user: currentUser, refreshUser } = useAuth();
  const [authToken, setAuthToken] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load token and user data
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        
        if (token) {
          const cleanToken = token ? token.replace(/^"(.*)"$/, '$1') : null;
          setAuthToken(cleanToken);
        }
      } catch (error) {
        console.error("❌ Error loading auth data:", error);
      }
    };

    loadAuthData();

    if (refreshUser && currentUser && isInitialLoad) {
      refreshUser().then(() => {
        setIsInitialLoad(false);
      }).catch(error => {
        console.error("❌ Failed to refresh user data:", error);
        setIsInitialLoad(false);
      });
    } else {
      setIsInitialLoad(false);
    }

  }, [currentUser, refreshUser, isInitialLoad]);

  // Get chat users
  const { 
    data: users = [], 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: async () => {
      try {
        const response = await getChatUsers();
        return response || [];
      } catch (apiError) {
        console.error("❌ Error in chat users query:", apiError);
        throw apiError;
      }
    },
    enabled: !!currentUser && !!authToken && !isInitialLoad,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Filter contacts and enhance with online status
  const enhancedContacts = React.useMemo(() => {
    if (!currentUser || !users.length) {
      return [];
    }

    return users
      .filter(user => user.id !== currentUser.id)
      .map(user => ({
        ...user,
        isOnline: onlineUsers.has(user.email),
        isTyping: typingUsers.has(user.email)
      }))
      .filter(user => 
        searchTerm ? 
        (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email?.toLowerCase().includes(searchTerm.toLowerCase())) : true
      )
      .sort((a, b) => {
        // Sort by online status first, then by name
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        return (a.full_name || a.email).localeCompare(b.full_name || b.email);
      });
  }, [users, currentUser, searchTerm, onlineUsers, typingUsers]);

  // Enhanced WebSocket connection with online status and typing indicators
  // FIXED WebSocket connection - Replace your current connectWebSocket function
const connectWebSocket = useCallback(() => {
  if (!currentUser?.email || !authToken) {
    setConnectionStatus("no_user");
    return;
  }

  // Clean up existing connection
  if (websocketRef.current) {
    websocketRef.current.close();
    websocketRef.current = null;
  }

  // Clear pending reconnect
  if (reconnectTimeoutRef.current) {
    clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = null;
  }

  setConnectionStatus("connecting");

  try {
    // ✅ FIXED: Each user connects with their own unique identity
    const wsUrl = `ws://localhost:8000/api/v1/chat/ws/${encodeURIComponent(currentUser.email)}?token=${authToken}&user_id=${currentUser.id}`;
    const ws = new WebSocket(wsUrl);
    websocketRef.current = ws;
    
    ws.onopen = () => {
      console.log("✅ WebSocket Connected successfully as:", currentUser.email);
      setConnectionStatus("connected");
      
      // Notify that current user is online
      const onlineStatus = {
        type: "user_online",
        user_email: currentUser.email,
        user_name: currentUser.full_name,
        user_id: currentUser.id // ✅ Added user_id for unique identification
      };
      ws.send(JSON.stringify(onlineStatus));
      
      // ✅ Request online users list specific to this user
      const getOnlineUsers = {
        type: "get_online_users",
        current_user_id: currentUser.id
      };
      ws.send(JSON.stringify(getOnlineUsers));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 WebSocket message received for user:", currentUser.email, data);
        
        if (data.type === "connection") {
          console.log("🔗 Connection confirmed for:", currentUser.email);
        } 
        else if (data.type === "user_online") {
          // ✅ Only add if it's not the current user
          if (data.user_email !== currentUser.email) {
            setOnlineUsers(prev => new Set([...prev, data.user_email]));
          }
        }
        else if (data.type === "user_offline") {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.user_email);
            return newSet;
          });
        }
        else if (data.type === "user_typing") {
          // ✅ Only handle typing for other users, not yourself
          if (data.user_email !== currentUser.email) {
            if (data.is_typing) {
              setTypingUsers(prev => new Set([...prev, data.user_email]));
            } else {
              setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.user_email);
                return newSet;
              });
            }
          }
        }
        else if (data.type === "online_users") {
          // ✅ Filter out current user from online users list
          const otherUsers = (data.users || []).filter(email => email !== currentUser.email);
          setOnlineUsers(new Set(otherUsers));
        }
        else if (data.type === "message_status") {
          console.log(`📨 Message ${data.message_id}: ${data.status} for user: ${currentUser.email}`);
          
          if (data.status === "sent") {
            setMessages(prev => prev.map(msg => 
              msg.isOptimistic && msg.id === `temp-${data.message_id}`
                ? { ...msg, isOptimistic: false, id: data.message_id }
                : msg
            ));
          }
          
          if (data.status === "delivered") {
            setMessages(prev => prev.map(msg => 
              msg.id === data.message_id
                ? { ...msg, status: "delivered" }
                : msg
            ));
          }
          
          if (data.status === "read") {
            setMessages(prev => prev.map(msg => 
              msg.id === data.message_id
                ? { ...msg, status: "read" }
                : msg
            ));
          }
        }
        // Handle actual chat messages
        else if (data.content && data.sender_email) {
          // ✅ FIXED: Only show messages where current user is either sender OR receiver
          const isRelevantToCurrentUser = 
            data.receiver_email === currentUser.email || 
            data.sender_email === currentUser.email;
            
          // ✅ FIXED: Only show in current chat if it's with the selected user
          const isForCurrentChat = selectedUser && (
            (data.sender_email === selectedUser.email && data.receiver_email === currentUser.email) ||
            (data.sender_email === currentUser.email && data.receiver_email === selectedUser.email)
          );
          
          if (isRelevantToCurrentUser && isForCurrentChat) {
            setMessages(prev => {
              // Prevent duplicate messages
              if (prev.some(msg => msg.id === data.id)) return prev;
              return [...prev, { ...data, status: "delivered" }];
            });
            
            // Send read receipt if message is from selected user to current user
            if (data.sender_email === selectedUser.email && data.receiver_email === currentUser.email) {
              const readReceipt = {
                type: "message_read",
                message_id: data.id,
                reader_id: currentUser.id // ✅ Identify who read the message
              };
              ws.send(JSON.stringify(readReceipt));
            }
          }
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message for user:", currentUser.email, error);
      }
    };

    ws.onclose = (event) => {
      console.log("🔴 WebSocket Disconnected for user:", currentUser.email);
      setConnectionStatus("disconnected");
      
      // Remove current user from online users
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentUser.email);
        return newSet;
      });
      
      // Auto-reconnect after delay
      if (event.code !== 1000) {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (currentUser?.email && authToken) {
            setConnectionStatus("reconnecting");
            connectWebSocket();
          }
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error for user:", currentUser.email, error);
      setConnectionStatus("error");
    };

  } catch (error) {
    console.error("❌ Failed to create WebSocket for user:", currentUser.email, error);
    setConnectionStatus("error");
  }
}, [currentUser?.email, currentUser?.id, authToken, selectedUser?.email]); // ✅ Added currentUser.id to dependencies
  // WebSocket connection management
  useEffect(() => {
    if (currentUser?.email && authToken) {
      connectWebSocket();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close(1000, "Component unmounting");
        websocketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connectWebSocket]);

  // Load chat history
  useEffect(() => {
    if (selectedUser && currentUser && authToken) {
      getChatHistory(selectedUser.email)
        .then(history => {
          const conversationMessages = Array.isArray(history) 
            ? history.filter(msg => 
                (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) ||
                (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
              ).map(msg => ({ ...msg, status: "read" }))
            : [];
          setMessages(conversationMessages);
        })
        .catch(error => {
          console.error("❌ Error loading chat history:", error);
          setMessages([]);
        });
    } else {
      setMessages([]);
    }
  }, [selectedUser, currentUser, authToken]);

  // Typing indicator handler
  const handleTyping = useCallback((isTyping) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) return;
    
    const typingData = {
      type: "user_typing",
      receiver_identifier: selectedUser?.email,
      is_typing: isTyping
    };
    
    websocketRef.current.send(JSON.stringify(typingData));
    setIsTyping(isTyping);
  }, [selectedUser?.email]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Enhanced send message with WhatsApp features
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    const ws = websocketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert("Please wait for connection...");
      return;
    }

    const messageData = {
      receiver_identifier: selectedUser.email,
      content: newMessage.trim(),
      type: "text"
    };

    // Stop typing indicator
    handleTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    try {
      // Optimistic UI update with WhatsApp-style message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        content: newMessage.trim(),
        sender_id: currentUser.id,
        sender_email: currentUser.email,
        sender_name: currentUser.full_name || "You",
        receiver_id: selectedUser.id,
        receiver_email: selectedUser.email,
        receiver_name: selectedUser.full_name || selectedUser.email,
        timestamp: new Date().toISOString(),
        isOptimistic: true,
        status: "sending"
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");
      
      // Send via WebSocket
      ws.send(JSON.stringify(messageData));
      
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("Failed to send message");
    }
  };

  // Enhanced input handler with typing indicators
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicators
    if (!isTyping) {
      handleTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  // Send on Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Refresh contacts
  const handleRefreshContacts = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("❌ Failed to refresh contacts:", error);
    }
  };

  // Manual reconnect
  const handleReconnect = () => {
    connectWebSocket();
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
    return colors[Math.abs(hash) % colors.length];
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

  const formatMessageTime = (timestamp) => {
    try {
      const now = new Date();
      const messageDate = new Date(timestamp);
      const diffInHours = (now - messageDate) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return messageDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        return messageDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      return '--:--';
    }
  };

  const isMyMessage = (message) => {
    return currentUser && message.sender_id === currentUser.id;
  };

  const getMessageStatus = (message) => {
    if (message.isOptimistic) return "⏳";
    if (message.status === "sending") return "🕒";
    if (message.status === "sent") return "✓";
    if (message.status === "delivered") return "✓✓";
    if (message.status === "read") return "✓✓🔵";
    return "✓";
  };

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected": return { text: "Connected", color: "#10B981", icon: "🟢" };
      case "connecting": return { text: "Connecting...", color: "#F59E0B", icon: "🟡" };
      case "reconnecting": return { text: "Reconnecting...", color: "#F59E0B", icon: "🟡" };
      case "disconnected": return { text: "Disconnected", color: "#EF4444", icon: "🔴" };
      case "error": return { text: "Connection Error", color: "#EF4444", icon: "🔴" };
      default: return { text: "Unknown", color: "#64748B", icon: "⚫" };
    }
  };

  const connectionInfo = getConnectionStatus();

  // Show auth required screen
  if (!currentUser || !authToken) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "#111827",
        color: "white",
        flexDirection: "column"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
        <div style={{ fontSize: "18px", marginBottom: "8px" }}>
          Authentication Required
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "#111827",
      minHeight: "100vh",
      color: "white",
      display: "flex",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Left Sidebar - Contacts List */}
      <div style={{
        width: "400px",
        borderRight: "1px solid #374151",
        background: "#1F2937",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #374151",
          background: "#374151",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: getAvatarColor(currentUser.full_name),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              position: "relative"
            }}>
              {getInitials(currentUser.full_name)}
              <div style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: connectionInfo.color,
                border: "2px solid #1F2937"
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>
                {currentUser.full_name || currentUser.email}
              </div>
              <div style={{ 
                fontSize: "12px", 
                color: connectionInfo.color,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                {connectionInfo.icon} {connectionInfo.text}
              </div>
            </div>
          </div>
          <button
            onClick={handleRefreshContacts}
            disabled={isFetching}
            style={{
              padding: "8px",
              background: "transparent",
              border: "none",
              color: "#9CA3AF",
              cursor: isFetching ? "not-allowed" : "pointer",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          >
            🔄
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "16px", borderBottom: "1px solid #374151" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                borderRadius: "20px",
                border: "none",
                background: "#374151",
                color: "white",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <div style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF"
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Online Status Header */}
        <div style={{
          padding: "12px 20px",
          background: "rgba(255,255,255,0.05)",
          borderBottom: "1px solid #374151"
        }}>
          <div style={{
            fontSize: "12px",
            color: "#9CA3AF",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            Online • {enhancedContacts.filter(user => user.isOnline).length}
          </div>
        </div>

        {/* Contacts List */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {isLoading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#9CA3AF" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
              Loading contacts...
            </div>
          ) : error ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#EF4444" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>❌</div>
              Error loading contacts
            </div>
          ) : enhancedContacts.length > 0 ? (
            enhancedContacts.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  cursor: "pointer",
                  background: selectedUser?.id === user.id ? "#4B5563" : "transparent",
                  borderLeft: selectedUser?.id === user.id ? "4px solid #25D366" : "none",
                  transition: "all 0.2s ease",
                  borderBottom: "1px solid #374151",
                  position: "relative"
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: getAvatarColor(user.full_name || user.email),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginRight: "16px"
                    }}
                  >
                    {getInitials(user.full_name || user.email)}
                  </div>
                  {user.isOnline && (
                    <div style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "12px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "#25D366",
                      border: "2px solid #1F2937"
                    }} />
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#F9FAFB",
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    {user.full_name || user.email}
                    {user.isTyping && (
                      <span style={{
                        fontSize: "12px",
                        color: "#25D366",
                        fontStyle: "italic"
                      }}>
                        typing...
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: user.isOnline ? "#25D366" : "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {user.isOnline ? "🟢 Online" : "⚫ Offline"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#9CA3AF"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
              <div style={{ fontSize: "16px", marginBottom: "8px" }}>
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
              padding: "16px 24px",
              borderBottom: "1px solid #374151",
              background: "#1F2937",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: getAvatarColor(selectedUser.full_name || selectedUser.email),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }}
                >
                  {getInitials(selectedUser.full_name || selectedUser.email)}
                </div>
                {onlineUsers.has(selectedUser.email) && (
                  <div style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "-2px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#25D366",
                    border: "2px solid #1F2937"
                  }} />
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#F9FAFB"
                }}>
                  {selectedUser.full_name || selectedUser.email}
                </div>
                <div style={{
                  fontSize: "14px",
                  color: onlineUsers.has(selectedUser.email) ? "#25D366" : "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  {onlineUsers.has(selectedUser.email) ? "🟢 Online" : "⚫ Offline"}
                  {typingUsers.has(selectedUser.email) && (
                    <span style={{ marginLeft: "8px", color: "#25D366", fontStyle: "italic" }}>
                      typing...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div style={{
              flex: 1,
              padding: "20px",
              overflow: "auto",
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
              display: "flex",
              flexDirection: "column",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23333' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}>
              {messages.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  color: "#9CA3AF",
                  padding: "60px 20px",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column"
                }}>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
                  <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                    No messages yet
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    Start a conversation with {selectedUser.full_name || selectedUser.email}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      style={{
                        display: "flex",
                        justifyContent: isMyMessage(message) ? "flex-end" : "flex-start",
                        marginBottom: "8px",
                        opacity: message.isOptimistic ? 0.7 : 1
                      }}
                    >
                      <div style={{
                        maxWidth: "70%",
                        background: isMyMessage(message) 
                          ? "#005c4b"  // WhatsApp green
                          : "#2a3942", // WhatsApp dark gray
                        padding: "8px 12px",
                        borderRadius: "8px",
                        borderTopRightRadius: isMyMessage(message) ? "0px" : "8px",
                        borderTopLeftRadius: isMyMessage(message) ? "8px" : "0px",
                        position: "relative",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}>
                        <div style={{ 
                          color: "white", 
                          fontSize: "15px",
                          lineHeight: "1.4",
                          wordWrap: "break-word"
                        }}>
                          {message.content}
                        </div>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "4px",
                          gap: "8px"
                        }}>
                          <div style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.6)",
                          }}>
                            {formatMessageTime(message.timestamp)}
                          </div>
                          {isMyMessage(message) && (
                            <div style={{
                              fontSize: "12px",
                              color: message.status === "read" ? "#53bdeb" : "rgba(255,255,255,0.6)"
                            }}>
                              {getMessageStatus(message)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {typingUsers.has(selectedUser.email) && (
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: "8px"
                    }}>
                      <div style={{
                        background: "#2a3942",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        borderTopLeftRadius: "0px"
                      }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <div style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#9CA3AF",
                            animation: "bounce 1.3s linear infinite"
                          }} />
                          <div style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#9CA3AF",
                            animation: "bounce 1.3s linear infinite 0.15s"
                          }} />
                          <div style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#9CA3AF",
                            animation: "bounce 1.3s linear infinite 0.3s"
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
              padding: "16px 24px",
              borderTop: "1px solid #374151",
              background: "#1F2937"
            }}>
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                alignItems: "flex-end"
              }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      connectionStatus !== "connected" 
                        ? "Connecting... Please wait" 
                        : "Type a message..."
                    }
                    rows="1"
                    disabled={connectionStatus !== "connected"}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "20px",
                      border: "none",
                      background: "#2a3942",
                      color: "white",
                      fontSize: "15px",
                      outline: "none",
                      resize: "none",
                      minHeight: "44px",
                      maxHeight: "120px",
                      fontFamily: "inherit",
                      lineHeight: "1.4"
                    }}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || connectionStatus !== "connected"}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: newMessage.trim() && connectionStatus === "connected"
                      ? "#25D366"
                      : "#2a3942",
                    border: "none",
                    color: "white",
                    cursor: newMessage.trim() && connectionStatus === "connected" ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    transition: "all 0.2s ease"
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
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
            color: "#9CA3AF"
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

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}
      </style>
    </div>
  );
};

export default Chat;