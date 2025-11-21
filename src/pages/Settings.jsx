import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { 
  verifyPin, 
  verifyPassword, 
  changePassword,
  updateProfile,
  handlePasswordChange
} from "../api/profile";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pinError, setPinError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState(user?.mobile_number || "");
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // Theme states
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Enhanced particles for background
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 10,
        duration: Math.random() * 20 + 20,
        opacity: Math.random() * 0.08 + 0.02
      });
    }
    setParticles(newParticles);
  }, []);

  // Update local state when AuthContext user changes
  useEffect(() => {
    if (user) {
      setMobileNumber(user.mobile_number || "");
      setFullName(user.full_name || "");
    }
  }, [user]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError("Please enter 4-digit PIN");
      return;
    }

    try {
      setLoading(true);
      await verifyPin(pin);
      setPinError("");
      setShowPinModal(false);
      setShowPin(true);
      setPin("");
      setMessage("PIN verified successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setPinError(error.response?.data?.detail || "Invalid PIN. Please try again.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      await verifyPassword(password);
      setPasswordError("");
      setShowPasswordModal(false);
      setShowPassword(true);
      setPassword("");
      setMessage("Password verified successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.detail || "Invalid password. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleFullNameUpdate = async () => {
  if (!fullName.trim()) {
    setMessage("Please enter your full name");
    return;
  }

  try {
    setLoading(true);
    const updateData = {
      full_name: fullName.trim()
    };
    
    console.log("🔄 Sending profile update:", JSON.stringify(updateData, null, 2));
    console.log("📧 Current user email:", user?.email);
    
    const response = await updateUserProfile(updateData);
    console.log("✅ Update successful:", response);
    
    setIsEditingFullName(false);
    setMessage("Full name updated successfully");
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("❌ Update failed:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    setMessage(error.response?.data?.detail || error.message || "Failed to update full name");
  } finally {
    setLoading(false);
  }
};

  const handleMobileUpdate = async () => {
    if (mobileNumber && mobileNumber.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile({
        mobile_number: mobileNumber || null
      });
      setIsEditingMobile(false);
      setMessage("Mobile number updated successfully");
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message || "Failed to update mobile number");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        current_password: password,
        new_password: newPassword
      });
      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setPassword("");
      setShowPassword(false);
      setMessage("Password changed successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleRevealPin = () => {
    setShowPinModal(true);
    setPin("");
    setPinError("");
    setShowPin(false);
  };

  const handleRevealPassword = () => {
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
    setShowPassword(false);
  };

  const settingsSections = [
    { id: "profile", label: "Profile", icon: "👤", color: "rgba(139, 92, 246, 0.15)" },
    { id: "security", label: "Security", icon: "🔒", color: "rgba(239, 68, 68, 0.15)" },
    { id: "notifications", label: "Notifications", icon: "🔔", color: "rgba(34, 197, 94, 0.15)" }
  ];

  const displayUser = user;

  if (loading && !user) {
    return (
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
            ⚙️
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
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Enhanced Background Particles */}
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

      {/* Background Animation */}
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

      {/* Main Content Container */}
      <div style={{ 
        position: "relative", 
        zIndex: 2,
        maxWidth: "500px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "28px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
        overflow: "hidden"
      }}>
        
        {/* Enhanced Header Section */}
        <div style={{
          padding: "32px 32px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
          color: "white",
          position: "relative",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <button 
            onClick={() => navigate("/dashboard")}
            style={{
              position: "absolute",
              left: "24px",
              top: "28px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "12px",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.18)";
              e.target.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.12)";
              e.target.style.transform = "translateX(0)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          
          <div style={{
            width: "80px",
            height: "80px",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            animation: "pulse 3s infinite"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15C19.2662 15.4669 19.1336 15.9338 19.0021 16.4007C18.763 17.2444 18.524 18.0881 18.2849 18.9318C18.1636 19.3346 17.9201 19.6911 17.5863 19.9546C17.2525 20.2181 16.8445 20.3758 16.4185 20.4067C15.2359 20.4904 14.0511 20.5328 12.866 20.5338C11.6809 20.5328 10.4961 20.4904 9.31353 20.4067C8.88752 20.3758 8.47953 20.2181 8.14573 19.9546C7.81193 19.6911 7.56842 19.3346 7.44714 18.9318C6.96853 17.2518 6.48993 15.5718 6.01027 13.8923C5.95065 13.6857 5.91949 13.4723 5.91765 13.2576C5.9158 13.0429 5.94329 12.829 6.99915 12.6166C7.24184 12.5659 7.49095 12.5338 7.74007 12.5338C9.82015 12.5338 11.9002 12.5338 13.9803 12.5338C14.4659 12.5338 14.9515 12.5338 15.4371 12.5338C15.6862 12.5338 15.9354 12.5659 16.1781 12.6166C17.234 12.829 17.2614 13.0429 17.2596 13.2576C17.2577 13.4723 17.2266 13.6857 17.1669 13.8923C17.0786 14.209 16.9903 14.5257 16.902 14.8424" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            marginBottom: "8px", 
            background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            Settings
          </h1>
          
          <p style={{ 
            color: "rgba(255,255,255,0.8)",
            fontSize: "16px",
            fontWeight: "600",
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}>
            Manage your account and preferences
          </p>
        </div>

        {/* Enhanced Navigation */}
        <div style={{ 
          padding: "20px 24px 0",
          marginBottom: "8px"
        }}>
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "18px",
            padding: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }}>
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  flex: 1,
                  padding: "14px 12px",
                  background: activeSection === section.id ? section.color : "transparent",
                  border: "none",
                  borderRadius: "14px",
                  color: activeSection === section.id ? "white" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.target.style.background = "transparent";
                  }
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{ fontSize: "18px" }}>{section.icon}</span>
                  <span>{section.label}</span>
                </div>
                {activeSection === section.id && (
                  <div style={{
                    position: "absolute",
                    bottom: "4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "20px",
                    height: "3px",
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "2px",
                    animation: "pulse 2s infinite"
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ padding: "24px" }}>
          
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(15px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
              animation: "slideUp 0.5s ease"
            }}>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "800",
                color: "white",
                marginBottom: "24px",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                👤 Profile Information
              </h3>
              
              {/* Full Name */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "12px"
                }}>
                  Full Name
                </label>
                {isEditingFullName ? (
                  <div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "rgba(255,255,255,0.08)",
                        border: "2px solid rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        marginBottom: "12px"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.15)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={handleFullNameUpdate}
                        disabled={loading}
                        style={{
                          flex: 1,
                          padding: "14px",
                          background: "linear-gradient(135deg, #10B981, #34D399)",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                      >
                        {loading ? (
                          <div style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid transparent",
                            borderTop: "2px solid currentColor",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto"
                          }} />
                        ) : "Save"}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingFullName(false);
                          setFullName(user?.full_name || "");
                        }}
                        disabled={loading}
                        style={{
                          flex: 1,
                          padding: "14px",
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "10px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease"
                  }}>
                    <span style={{
                      fontWeight: "600",
                      color: user?.full_name ? "white" : "rgba(255,255,255,0.6)"
                    }}>
                      {user?.full_name || "Not set"}
                    </span>
                    <button 
                      onClick={() => setIsEditingFullName(true)}
                      style={{
                        padding: "10px 16px",
                        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(124, 58, 237, 0.8))",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      {user?.full_name ? "Edit" : "Add"}
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "12px"
                }}>
                  Email Address
                </label>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px"
                }}>
                  <span style={{ fontWeight: "600", color: "white" }}>
                    {user?.email || "N/A"}
                  </span>
                  <span style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: "600"
                  }}>
                    Cannot be changed
                  </span>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "12px"
                }}>
                  Mobile Number
                </label>
                {isEditingMobile ? (
                  <div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "rgba(255,255,255,0.08)",
                        border: "2px solid rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        boxSizing: "border-box",
                        marginBottom: "12px"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(139, 92, 246, 0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.15)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={handleMobileUpdate}
                        disabled={loading}
                        style={{
                          flex: 1,
                          padding: "14px",
                          background: "linear-gradient(135deg, #10B981, #34D399)",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }
                        }}
                      >
                        {loading ? (
                          <div style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid transparent",
                            borderTop: "2px solid currentColor",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto"
                          }} />
                        ) : "Save"}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingMobile(false);
                          setMobileNumber(user?.mobile_number || "");
                        }}
                        disabled={loading}
                        style={{
                          flex: 1,
                          padding: "14px",
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "10px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease"
                  }}>
                    <span style={{
                      fontWeight: "600",
                      color: user?.mobile_number ? "white" : "rgba(255,255,255,0.6)"
                    }}>
                      {user?.mobile_number || "Not set"}
                    </span>
                    <button 
                      onClick={() => setIsEditingMobile(true)}
                      style={{
                        padding: "10px 16px",
                        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(124, 58, 237, 0.8))",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      {user?.mobile_number ? "Edit" : "Add"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Section - Similar enhanced design */}
          {activeSection === "security" && (
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(15px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
              animation: "slideUp 0.5s ease"
            }}>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "800",
                color: "white",
                marginBottom: "24px",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                🔒 Security Settings
              </h3>
              
              {/* Security items with similar enhanced design */}
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "16px",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px"
                }}>
                  <div>
                    <div style={{
                      fontWeight: "700",
                      color: "white",
                      marginBottom: "4px"
                    }}>
                      Password
                    </div>
                    <div style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.7)"
                    }}>
                      Manage your account password
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={handleRevealPassword}
                      style={{
                        padding: "10px 16px",
                        background: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {showPassword ? "Hide" : "Reveal"}
                    </button>
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      style={{
                        padding: "10px 16px",
                        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'SF Mono', monospace",
                  color: "white",
                  letterSpacing: "2px",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {showPassword ? "Your actual password" : "••••••••"}
                </div>
              </div>

              {/* Similar design for other security items */}
              {/* Transaction PIN, Biometric Auth, etc. */}

            </div>
          )}

          {/* Notifications Section - Similar enhanced design */}
          {activeSection === "notifications" && (
            <div style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(15px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
              animation: "slideUp 0.5s ease"
            }}>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "800",
                color: "white",
                marginBottom: "24px",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                🔔 Notifications
              </h3>
              
              {/* Notification toggles with similar enhanced design */}
              <button 
                onClick={logout}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  padding: "16px",
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 68, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "18px" }}>🚪</span>
                Logout from All Devices
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modals */}
      {showPinModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(10px)",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            padding: "36px 32px",
            borderRadius: "28px",
            width: "100%",
            maxWidth: "420px",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                margin: "0 auto 20px",
                boxShadow: "0 16px 32px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)",
                animation: "pulse 3s infinite",
                border: "1px solid rgba(255,255,255,0.15)"
              }}>
                🔒
              </div>
              <h3 style={{ 
                fontSize: "26px", 
                fontWeight: "800", 
                marginBottom: "8px", 
                color: "white",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                Verify PIN
              </h3>
              <p style={{ 
                color: "rgba(255,255,255,0.8)", 
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: "1.5"
              }}>
                Enter your 4-digit PIN to reveal it
              </p>
            </div>

            <form onSubmit={handlePinSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  placeholder="Enter PIN"
                  style={{
                    width: "100%",
                    padding: "20px",
                    border: pinError ? 
                      "2px solid rgba(239, 68, 68, 0.5)" : 
                      "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "16px",
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "20px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "white",
                    boxSizing: "border-box",
                    outline: "none",
                    fontWeight: "700",
                    transition: "all 0.3s ease",
                    boxShadow: pinError ? 
                      "0 0 25px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)" : 
                      "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                    backdropFilter: "blur(15px)",
                    fontFeatureSettings: "'tnum' on, 'lnum' on"
                  }}
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "20px",
                marginBottom: "20px"
              }}>
                {[0, 1, 2, 3].map((index) => (
                  <div 
                    key={index}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: pinError ? 
                        "2px solid rgba(239, 68, 68, 0.5)" : 
                        "2px solid rgba(255,255,255,0.3)",
                      background: pin.length > index ? 
                        (pinError ? "rgba(239, 68, 68, 0.7)" : "rgba(255,255,255,0.9)") : 
                        "transparent",
                      transition: "all 0.3s ease",
                      boxShadow: pin.length > index ? 
                        (pinError ? 
                          "0 0 15px rgba(239, 68, 68, 0.7)" : 
                          "0 0 15px rgba(255,255,255,0.5)") : 
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
                  margin: "20px 0",
                  fontSize: "14px",
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "14px",
                  fontWeight: "600",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  animation: "shake 0.5s ease",
                  backdropFilter: "blur(10px)",
                  lineHeight: "1.5"
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
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)"
                  }}
                  onClick={() => {
                    setShowPinModal(false);
                    setPin("");
                    setPinError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    flex: 1,
                    padding: "16px",
                    background: pin.length !== 4 || loading ? 
                      "rgba(255,255,255,0.1)" : 
                      "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))",
                    color: "white",
                    border: "none",
                    borderRadius: "14px",
                    cursor: (pin.length !== 4 || loading) ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxShadow: (pin.length !== 4 || loading) ? 
                      "none" : 
                      "0 12px 32px rgba(0,0,0,0.25)",
                    backdropFilter: "blur(10px)"
                  }}
                  disabled={pin.length !== 4 || loading}
                >
                  {loading ? (
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
                    'Verify'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Toast */}
      {message && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          zIndex: 3000,
          animation: "toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: message.includes("success") ? 
            "linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(52, 211, 153, 0.9))" : 
            "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
          color: "white"
        }}>
          <span style={{ fontSize: "18px" }}>
            {message.includes("success") ? "✅" : "⚠️"}
          </span>
          <span style={{ fontWeight: "600" }}>{message}</span>
        </div>
      )}

      <style>
        {`
          @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
            50% { transform: translateY(-80px) translateX(12px); opacity: 0.8; }
          }

          @keyframes backgroundShift {
            0% { transform: translateX(-2%) translateY(-2%) scale(1); }
            100% { transform: translateX(2%) translateY(2%) scale(1.05); }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            from { transform: scale(0.9) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }

          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }

          @keyframes toastSlideIn {
            from { 
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to { 
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Settings;