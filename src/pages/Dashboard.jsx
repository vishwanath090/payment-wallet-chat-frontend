// In Dashboard.jsx - Alternative clean import
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMyWallet } from "../api/wallet";
import { useNavigate } from "react-router-dom";
import Contacts from "./Contacts";
import { verifyPin } from "../api/profile";
import { isPinError, shouldNotLogout } from "../api/wallet"; // ✅ Import helpers from wallet

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState("");
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovering, setIsHovering] = useState(null);
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState(["Home", "Dashboard"]);
  const [showRewardsMessage, setShowRewardsMessage] = useState(false);
  const [showTravelMessage, setShowTravelMessage] = useState(false);

  const { data: wallet, isLoading, error, refetch } = useQuery({
    queryKey: ["wallet"],
    queryFn: getMyWallet,
  });

  // ✅ FIXED: PIN verification with proper error handling
  const verifyPinMutation = useMutation({
    mutationFn: verifyPin,
    onSuccess: (data) => {
      console.log("PIN Verification Success:", data);
      setPinError("");
      setShowBalance(true);
      setShowPinModal(false);
      setPin("");
      // Refetch to get latest balance
      refetch();
    },
    onError: (error) => {
      console.error("PIN Verification Error:", error);
      
      // ✅ FIXED: Check if it's a PIN error (don't logout)
      if (isPinError(error)) {
        console.log('PIN error - show message to user without logging out');
        setPinError(error.message || "Invalid PIN. Please try again.");
        setPin("");
        setShowBalance(false);
        return;
      }
      
      // ✅ FIXED: Check if it's any other type of wallet error (don't logout)
      if (shouldNotLogout(error)) {
        console.log('Wallet error - show message to user without logging out');
        setPinError(error.message || "Verification failed. Please try again.");
        setPin("");
        setShowBalance(false);
        return;
      }
      
      // For other errors, use the original error message
      const errorMsg = error?.message || error?.response?.data?.detail || "Verification failed. Please try again.";
      setPinError(errorMsg);
      setPin("");
      setShowBalance(false);
    }
  });

  // Enhanced floating particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 15,
        opacity: Math.random() * 0.1 + 0.05
      });
    }
    setParticles(newParticles);
  }, []);

  // Enhanced sparkle effects
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => [
        ...prev.slice(-8),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 60,
          size: Math.random() * 15 + 10,
          duration: Math.random() * 0.8 + 0.4
        }
      ]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShowBalance = () => {
    if (showBalance) {
      setShowBalance(false);
    } else {
      setShowPinModal(true);
      setPinError("");
      setPin("");
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setPinError("Please enter 4-digit PIN");
      return;
    }

    try {
      await verifyPinMutation.mutateAsync({ pin: pin });
    } catch (error) {
      // ✅ FIXED: Error is now handled in onError above
      console.error("PIN verification failed:", error);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    if (pinError) setPinError("");
  };

  // Fixed Bento Grid Actions
  const bentoActions = [
    {
      icon: "💰",
      label: "Balance",
      value: showBalance ? `₹${wallet?.balance?.toLocaleString() || "0.00"}` : "••••••",
      color: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      glow: "0 0 40px rgba(99, 102, 241, 0.3)",
      description: "Your total balance",
      type: "balance",
      size: "large",
      animation: "pulse"
    },
    {
      icon: "📤", 
      label: "Send Money",
      value: "Transfer",
      color: "linear-gradient(135deg, #10B981, #059669)",
      glow: "0 0 30px rgba(16, 185, 129, 0.25)",
      description: "Quick transfer",
      type: "action",
      size: "medium",
      route: "/send-money",
      animation: "bounce"
    },
    {
      icon: "💸",
      label: "Add Money", 
      value: "Deposit",
      color: "linear-gradient(135deg, #F59E0B, #D97706)",
      glow: "0 0 30px rgba(245, 158, 11, 0.25)",
      description: "Add funds",
      type: "action",
      size: "medium",
      route: "/add-money",
      animation: "shake"
    },
    {
      icon: "🌍",
      label: "Travel", 
      value: "Explore",
      color: "linear-gradient(135deg, #EC4899, #BE185D)",
      glow: "0 0 30px rgba(236, 72, 153, 0.25)",
      description: "Book travel",
      type: "action",
      size: "medium",
      animation: "glow"
    },
    {
      icon: "⚙️",
      label: "Settings",
      value: "Manage",
      color: "linear-gradient(135deg, #6B7280, #4B5563)",
      glow: "0 0 30px rgba(107, 114, 128, 0.25)",
      description: "Account settings",
      type: "action",
      size: "small",
      route: "/settings",
      animation: "float"
    },
    {
      icon: "🎁",
      label: "Rewards",
      value: "Earn",
      color: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
      glow: "0 0 30px rgba(139, 92, 246, 0.25)",
      description: "View rewards",
      type: "action",
      size: "small",
      animation: "glow"
    },
    {
      icon: "💬",
      label: "Chat",
      value: "Messages",
      color: "linear-gradient(135deg, #EC4899, #BE185D)",
      glow: "0 0 30px rgba(139, 92, 246, 0.25)",
      description: "REAL-TIME CHAT",
      type: "action",
      size: "small",
      route: "/chat",
      animation: "glow",
    }
  ];

  const travelServices = [
    {
      icon: "🚆",
      label: "Train Booking",
      color: "linear-gradient(135deg, #EF4444, #DC2626)",
      glow: "0 0 25px rgba(239, 68, 68, 0.3)",
      description: "Book train tickets"
    },
    {
      icon: "🚌",
      label: "Bus Tickets",
      color: "linear-gradient(135deg, #10B981, #059669)",
      glow: "0 0 25px rgba(16, 185, 129, 0.3)",
      description: "Intercity travel"
    },
    {
      icon: "✈️",
      label: "Flight Booking",
      color: "linear-gradient(135deg, #3B82F6, #2563EB)",
      glow: "0 0 25px rgba(59, 130, 246, 0.3)",
      description: "Book flights"
    },
    {
      icon: "🏨",
      label: "Hotels",
      color: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
      glow: "0 0 25px rgba(139, 92, 246, 0.3)",
      description: "Book hotels"
    }
  ];

  const handleBentoAction = (action) => {
    if (action.type === "balance") {
      handleShowBalance();
    } else if (action.route) {
      navigate(action.route);
    } else if (action.label === "Travel") {
      setShowTravelModal(true);
    } else if (action.label === "Rewards") {
      setShowRewardsMessage(true);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowTravelMessage(true);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    setShowTravelModal(false);
  };

  if (isLoading) return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
        animation: "backgroundShift 6s ease-in-out infinite alternate"
      }} />
      
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ 
          fontSize: "64px", 
          marginBottom: "24px",
          animation: "float 3s ease-in-out infinite",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
        }}>
          💫
        </div>
        <div style={{
          width: "160px",
          height: "3px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
          margin: "0 auto 20px",
          borderRadius: "4px",
          animation: "shimmer 2s infinite",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))"
        }} />
        <p style={{ 
          color: "rgba(255,255,255,0.8)", 
          fontSize: "15px",
          fontWeight: "500",
          textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          letterSpacing: "0.3px"
        }}>
          Loading your wallet...
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)",
        animation: "pulse 4s ease-in-out infinite"
      }} />
      
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div style={{ 
          fontSize: "72px", 
          marginBottom: "20px",
          animation: "bounce 2s infinite",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
        }}>😞</div>
        <h2 style={{ 
          fontSize: "22px", 
          fontWeight: "700", 
          marginBottom: "12px", 
          color: "white",
          textAlign: "center",
          textShadow: "0 2px 6px rgba(0,0,0,0.3)"
        }}>
          Failed to Load Wallet
        </h2>
        <p style={{ 
          color: "rgba(255,255,255,0.7)", 
          marginBottom: "28px", 
          textAlign: "center",
          maxWidth: "280px",
          fontWeight: "400",
          lineHeight: "1.5"
        }}>
          {error?.message || "Unable to load your wallet data"}
        </p>
        <button 
          onClick={() => refetch()}
          style={{
            padding: "14px 28px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
            color: "white",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 16px 32px rgba(0,0,0,0.3)";
            e.target.style.background = "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.25)";
            e.target.style.background = "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))";
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
      minHeight: "100vh",
      color: "white",
      padding: "0",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      maxWidth: "100vw",
      boxSizing: "border-box"
    }}>
      
      {/* Enhanced Animated Background Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(255,255,255,${particle.opacity}) 0%, transparent 70%)`,
            borderRadius: "50%",
            animation: `particleFloat ${particle.duration}s infinite ease-in-out ${particle.delay}s`,
            filter: "blur(1px)",
            pointerEvents: "none"
          }}
        />
      ))}

      {/* Enhanced Sparkle Effects */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          style={{
            position: "absolute",
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
            animation: `sparklePop ${sparkle.duration}s ease-out forwards`,
            pointerEvents: "none",
            filter: "blur(1px)"
          }}
        />
      ))}

      {/* Background gradient animation */}
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
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "30px",
          padding: "12px 0",
          position: "relative"
        }}>
          {breadcrumbPath.map((item, index) => (
            <React.Fragment key={index}>
              <span
                style={{
                  color: index === breadcrumbPath.length - 1 ? "white" : "rgba(255,255,255,0.6)",
                  fontSize: index === breadcrumbPath.length - 1 ? "16px" : "14px",
                  fontWeight: index === breadcrumbPath.length - 1 ? "700" : "500",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: index === breadcrumbPath.length - 1 ? 
                    "rgba(255,255,255,0.1)" : "transparent",
                  backdropFilter: index === breadcrumbPath.length - 1 ? "blur(10px)" : "none",
                  border: index === breadcrumbPath.length - 1 ? 
                    "1px solid rgba(255,255,255,0.1)" : "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  animation: index === breadcrumbPath.length - 1 ? "breadcrumbPulse 2s infinite" : "none"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.15)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = index === breadcrumbPath.length - 1 ? 
                    "rgba(255,255,255,0.1)" : "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {item}
              </span>
              {index < breadcrumbPath.length - 1 && (
                <span style={{ 
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "12px"
                }}>
                  ›
                </span>
              )}
            </React.Fragment>
          ))}
          
          {/* Current Time */}
          <div style={{
            marginLeft: "auto",
            textAlign: "right"
          }}>
            <div style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "2px",
              fontWeight: "500"
            }}>
              {formatDate(currentTime)}
            </div>
            <div style={{
              fontSize: "18px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "timeGlow 3s ease-in-out infinite alternate"
            }}>
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* App Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          position: "relative"
        }}>
          <h1 style={{ 
            fontSize: "42px", 
            fontWeight: "800", 
            marginBottom: "8px", 
            background: "linear-gradient(135deg, #FFFFFF, #F3F4F6, #E5E7EB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 8px 24px rgba(0,0,0,0.4)",
            letterSpacing: "-0.5px",
            animation: "titleGlow 4s ease-in-out infinite alternate"
          }}>
            WalletPay
          </h1>
          <p style={{ 
            color: "rgba(255,255,255,0.7)",
            fontSize: "16px",
            fontWeight: "500",
            letterSpacing: "0.3px",
            margin: 0
          }}>
            Your Digital Financial Companion
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: "flex", 
          background: "rgba(255,255,255,0.05)",
          padding: "6px",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
          marginBottom: "30px",
          maxWidth: "300px",
          margin: "0 auto 40px"
        }}>
          {["dashboard", "contacts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "14px 20px",
                background: activeTab === tab ? 
                  "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))" : "transparent",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                textTransform: "capitalize",
                letterSpacing: "0.3px"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {activeTab === tab && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
                  borderRadius: "12px",
                  animation: "tabPulse 3s infinite"
                }} />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                {tab}
              </span>
            </button>
          ))}
        </div>

        {activeTab === "dashboard" ? (
          <div style={{ flex: 1 }}>
            {/* Bento Grid Layout */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(3, auto)",
              gap: "20px",
              marginBottom: "40px"
            }}>
              {bentoActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleBentoAction(action)}
                  onMouseEnter={() => setIsHovering(index)}
                  onMouseLeave={() => setIsHovering(null)}
                  style={{
                    gridColumn: action.size === "large" ? "span 2" : "span 1",
                    gridRow: action.size === "large" ? "span 2" : "span 1",
                    cursor: "pointer",
                    padding: action.size === "large" ? "30px" : "24px",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    backdropFilter: "blur(25px)",
                    position: "relative",
                    overflow: "hidden",
                    transform: isHovering === index ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                    boxShadow: isHovering === index ? 
                      `0 24px 48px rgba(0,0,0,0.3), ${action.glow}` : 
                      `0 12px 32px rgba(0,0,0,0.2), ${action.glow}`,
                    animation: `${action.animation} 4s infinite`
                  }}
                >
                  {/* Animated background gradient */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: action.color,
                    opacity: isHovering === index ? 0.15 : 0.1,
                    transition: "opacity 0.3s ease",
                    zIndex: 1
                  }} />

                  {/* Content */}
                  <div style={{ 
                    position: "relative", 
                    zIndex: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: action.size === "large" ? "space-between" : "flex-start"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: action.size === "large" ? "20px" : "12px"
                    }}>
                      <div style={{
                        width: action.size === "large" ? "60px" : "48px",
                        height: action.size === "large" ? "60px" : "48px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: action.size === "large" ? "16px" : "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: action.size === "large" ? "24px" : "20px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}>
                        {action.icon}
                      </div>
                      {action.size !== "large" && (
                        <div style={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.7)",
                          fontWeight: "500"
                        }}>
                          {action.description}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ 
                        fontSize: action.size === "large" ? "18px" : "14px",
                        fontWeight: "600",
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: "4px"
                      }}>
                        {action.label}
                      </div>
                      <div style={{ 
                        fontSize: action.size === "large" ? "32px" : "20px",
                        fontWeight: "800",
                        color: "white",
                        background: action.type === "balance" && showBalance ? 
                          "linear-gradient(135deg, #FFFFFF, #E5E7EB)" : "none",
                        WebkitBackgroundClip: action.type === "balance" && showBalance ? "text" : "none",
                        WebkitTextFillColor: action.type === "balance" && showBalance ? "transparent" : "currentColor",
                        backgroundClip: action.type === "balance" && showBalance ? "text" : "none",
                        textShadow: action.type === "balance" && showBalance ? 
                          "0 4px 16px rgba(255,255,255,0.3)" : "none",
                        animation: action.type === "balance" && showBalance ? 
                          "balanceGlow 2s ease-in-out infinite alternate" : "none",
                        fontFeatureSettings: "'tnum' on, 'lnum' on"
                      }}>
                        {action.value}
                      </div>
                    </div>

                    {action.size === "large" && (
                      <div style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: "500",
                        marginTop: "12px"
                      }}>
                        {action.description}
                      </div>
                    )}
                  </div>

                  {/* Hover effect */}
                  {isHovering === index && (
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100%",
                      height: "100%",
                      background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
                      transform: "translate(-50%, -50%)",
                      animation: "ripple 0.6s ease-out",
                      zIndex: 1
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* Quick Tips Section */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              padding: "25px",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
              marginBottom: "20px"
            }}>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "700",
                color: "white",
                marginBottom: "16px",
                textShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}>
                Quick Tips
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px"
              }}>
                <div style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "white", marginBottom: "4px" }}>
                    💡 Secure Your Account
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                    Always keep your PIN confidential and enable 2FA for extra security.
                  </div>
                </div>
                <div style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "white", marginBottom: "4px" }}>
                    🚀 Fast Transactions
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                    Send money instantly to any contact with zero processing fees.
                  </div>
                </div>
                <div style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "white", marginBottom: "4px" }}>
                    🎁 Earn Rewards
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                    Transact more to unlock exciting rewards and cashback offers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Contacts />
        )}
      </div>

      {/* Rewards Message Modal */}
      {showRewardsMessage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1002,
          padding: "20px",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.08)",
            padding: "32px 28px",
            borderRadius: "28px",
            width: "100%",
            maxWidth: "420px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
            position: "relative",
            animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 20px",
              boxShadow: "0 16px 32px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)",
              animation: "pulse 3s infinite",
              border: "1px solid rgba(139, 92, 246, 0.2)"
            }}>
              🎁
            </div>
            <h3 style={{ 
              fontSize: "24px", 
              fontWeight: "700", 
              marginBottom: "12px", 
              color: "white",
              background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Rewards Program
            </h3>
            <p style={{ 
              color: "rgba(255,255,255,0.8)", 
              fontSize: "16px",
              fontWeight: "500",
              lineHeight: "1.6",
              marginBottom: "24px"
            }}>
              Start transacting to unlock exciting rewards! Make payments, send money, and use our services to earn points and cashback.
            </p>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              marginBottom: "24px"
            }}>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "600", marginBottom: "8px" }}>
                🎯 How to earn rewards:
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", textAlign: "left", lineHeight: "1.5" }}>
                • Send money to friends & family<br/>
                • Pay bills and merchants<br/>
                • Add money to your wallet<br/>
                • Refer friends to WalletPay
              </div>
            </div>
            <button 
              onClick={() => setShowRewardsMessage(false)}
              style={{
                padding: "16px 32px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                backdropFilter: "blur(10px)",
                width: "100%"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
              }}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* Travel Services Modal */}
      {showTravelModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1002,
          padding: "20px",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.08)",
            padding: "32px 28px",
            borderRadius: "28px",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
            position: "relative",
            animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(190, 24, 93, 0.1))",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                margin: "0 auto 20px",
                boxShadow: "0 16px 32px rgba(236, 72, 153, 0.2), 0 0 20px rgba(236, 72, 153, 0.1)",
                animation: "pulse 3s infinite",
                border: "1px solid rgba(236, 72, 153, 0.2)"
              }}>
                🌍
              </div>
              <h3 style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                marginBottom: "8px", 
                color: "white"
              }}>
                Travel Services
              </h3>
              <p style={{ 
                color: "rgba(255,255,255,0.7)", 
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1.5"
              }}>
                Book your next adventure with WalletPay
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginBottom: "24px"
            }}>
              {travelServices.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  style={{
                    cursor: "pointer",
                    padding: "20px 16px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.3), ${service.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: service.color,
                    opacity: 0.1,
                    zIndex: 1
                  }} />
                  <div style={{ 
                    fontSize: "28px", 
                    marginBottom: "12px",
                    position: "relative",
                    zIndex: 2
                  }}>
                    {service.icon}
                  </div>
                  <div style={{ 
                    fontSize: "14px", 
                    fontWeight: "600",
                    color: "white",
                    position: "relative",
                    zIndex: 2
                  }}>
                    {service.label}
                  </div>
                  <div style={{ 
                    fontSize: "11px", 
                    color: "rgba(255,255,255,0.6)",
                    marginTop: "4px",
                    position: "relative",
                    zIndex: 2
                  }}>
                    {service.description}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <button 
                type="button" 
                style={{ 
                  flex: 1,
                  padding: "16px",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
                onClick={closeServiceModal}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Travel Service Under Development Message */}
      {showTravelMessage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1003,
          padding: "20px",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.08)",
            padding: "32px 28px",
            borderRadius: "28px",
            width: "100%",
            maxWidth: "420px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
            position: "relative",
            animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            textAlign: "center"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 20px",
              boxShadow: "0 16px 32px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)",
              animation: "pulse 3s infinite",
              border: "1px solid rgba(59, 130, 246, 0.2)"
            }}>
              🚧
            </div>
            <h3 style={{ 
              fontSize: "24px", 
              fontWeight: "700", 
              marginBottom: "12px", 
              color: "white",
              background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Coming Soon!
            </h3>
            <p style={{ 
              color: "rgba(255,255,255,0.8)", 
              fontSize: "16px",
              fontWeight: "500",
              lineHeight: "1.6",
              marginBottom: "24px"
            }}>
              {selectedService ? `${selectedService.label} service is currently under development.` : "This travel service is currently under development."}
            </p>
            <p style={{ 
              color: "rgba(255,255,255,0.6)", 
              fontSize: "14px",
              lineHeight: "1.5",
              marginBottom: "24px"
            }}>
              We're working hard to bring you the best travel booking experience. Stay tuned for updates!
            </p>
            <button 
              onClick={() => setShowTravelMessage(false)}
              style={{
                padding: "16px 32px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                backdropFilter: "blur(10px)",
                width: "100%"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
              }}
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1002,
          padding: "20px",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.08)",
            padding: "32px 28px",
            borderRadius: "28px",
            width: "100%",
            maxWidth: "380px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(40px)",
            position: "relative",
            animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                margin: "0 auto 20px",
                boxShadow: "0 16px 32px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)",
                animation: "pulse 3s infinite",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                🔒
              </div>
              <h3 style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                marginBottom: "8px", 
                color: "white"
              }}>
                Enter PIN
              </h3>
              <p style={{ 
                color: "rgba(255,255,255,0.7)", 
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1.5"
              }}>
                Enter your 4-digit security PIN to view balance
              </p>
            </div>

            <form onSubmit={handlePinSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="password"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength={4}
                  placeholder="Enter PIN"
                  style={{
                    width: "100%",
                    padding: "18px",
                    border: pinError ? 
                      "2px solid rgba(239, 68, 68, 0.4)" : 
                      "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "12px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "white",
                    boxSizing: "border-box",
                    outline: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: pinError ? 
                      "0 0 25px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)" : 
                      "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                    backdropFilter: "blur(15px)",
                    fontFeatureSettings: "'tnum' on, 'lnum' on"
                  }}
                  autoFocus
                  disabled={verifyPinMutation.isPending}
                />
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "16px",
                marginBottom: "20px"
              }}>
                {[0, 1, 2, 3].map((index) => (
                  <div 
                    key={index}
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: pinError ? 
                        "2px solid rgba(239, 68, 68, 0.4)" : 
                        "2px solid rgba(255,255,255,0.25)",
                      background: pin.length > index ? 
                        (pinError ? "rgba(239, 68, 68, 0.6)" : "rgba(255,255,255,0.8)") : 
                        "transparent",
                      transition: "all 0.3s ease",
                      boxShadow: pin.length > index ? 
                        (pinError ? 
                          "0 0 12px rgba(239, 68, 68, 0.6)" : 
                          "0 0 12px rgba(255,255,255,0.4)") : 
                        "none",
                      animation: pin.length > index ? "pulse 2s infinite" : "none"
                    }}
                  />
                ))}
              </div>

              {pinError && (
                <div style={{ 
                  color: "#FCA5A5", 
                  textAlign: "center", 
                  margin: "18px 0",
                  fontSize: "13px",
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.08)",
                  borderRadius: "14px",
                  fontWeight: "500",
                  border: "1px solid rgba(239, 68, 68, 0.15)",
                  animation: "shake 0.5s ease",
                  backdropFilter: "blur(10px)",
                  lineHeight: "1.4"
                }}>
                  {pinError}
                </div>
              )}

              <div style={{ display: "flex", gap: "14px" }}>
                <button 
                  type="button" 
                  style={{ 
                    flex: 1,
                    padding: "16px",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "14px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)"
                  }}
                  onClick={() => {
                    setShowPinModal(false);
                    setPin("");
                    setPinError("");
                  }}
                  disabled={verifyPinMutation.isPending}
                  onMouseEnter={(e) => {
                    if (!verifyPinMutation.isPending) {
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!verifyPinMutation.isPending) {
                      e.target.style.background = "rgba(255,255,255,0.05)";
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    flex: 1,
                    padding: "16px",
                    background: pin.length !== 4 || verifyPinMutation.isPending ? 
                      "rgba(255,255,255,0.08)" : 
                      "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08))",
                    color: "white",
                    border: "none",
                    borderRadius: "14px",
                    cursor: (pin.length !== 4 || verifyPinMutation.isPending) ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxShadow: (pin.length !== 4 || verifyPinMutation.isPending) ? 
                      "none" : 
                      "0 12px 32px rgba(0,0,0,0.25)",
                    backdropFilter: "blur(10px)"
                  }}
                  disabled={pin.length !== 4 || verifyPinMutation.isPending}
                  onMouseEnter={(e) => {
                    if (pin.length === 4 && !verifyPinMutation.isPending) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pin.length === 4 && !verifyPinMutation.isPending) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
                    }
                  }}
                >
                  {verifyPinMutation.isPending ? (
                    <>
                      <div style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid transparent",
                        borderTop: "2px solid currentColor",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        display: "inline-block",
                        marginRight: "8px"
                      }} />
                      Verifying...
                    </>
                  ) : (
                    "View Balance"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
            50% { transform: translateY(-80px) translateX(12px); opacity: 0.8; }
          }

          @keyframes sparklePop {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
          }

          @keyframes titleGlow {
            from { filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
            to { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
          }

          @keyframes timeGlow {
            from { filter: drop-shadow(0 0 6px rgba(255,255,255,0.3)); }
            to { filter: drop-shadow(0 0 15px rgba(255,255,255,0.5)); }
          }

          @keyframes balanceGlow {
            from { filter: drop-shadow(0 0 10px rgba(255,255,255,0.4)); }
            to { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
          }

          @keyframes tabPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }

          @keyframes breadcrumbPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
            50% { box-shadow: 0 0 0 4px rgba(255,255,255,0.1); }
          }

          @keyframes ripple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.03); opacity: 0.9; }
          }

          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-6px); }
            70% { transform: translateY(-3px); }
            90% { transform: translateY(-1px); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }

          @keyframes glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes scaleIn {
            from { transform: scale(0.9) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes backgroundShift {
            0% { transform: translateX(-2%) translateY(-2%) scale(1); }
            100% { transform: translateX(2%) translateY(2%) scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;