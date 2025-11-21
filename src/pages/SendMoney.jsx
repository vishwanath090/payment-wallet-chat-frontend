import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transfer } from "../api/wallet";
import { getChatUsers } from "../api/chat";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const SendMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qc = useQueryClient();
  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [animationStage, setAnimationStage] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const [particles, setParticles] = useState([]);
  
  // Email validation states
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    isLoading: false,
    error: "",
    userFound: false,
    availableUsers: []
  });

  // Refs to prevent multiple API calls
  const availableUsersLoaded = useRef(false);
  const validationTimeoutRef = useRef(null);

  const contact = location.state?.contact || {
    email: searchParams.get('email'),
    name: searchParams.get('email')?.split('@')[0] || "Contact"
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || 
                     JSON.parse(localStorage.getItem("userProfile"))?.email || 
                     "current@user.com";
    setCurrentUserEmail(userEmail);
    
    // Load available users only once
    if (!availableUsersLoaded.current) {
      loadAvailableUsers();
      availableUsersLoaded.current = true;
    }
    
    if (contact?.email) {
      setToEmail(contact.email);
      handleEmailValidation(contact.email);
    }

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [contact]);

  // Load available users from chat API
  const loadAvailableUsers = async () => {
    try {
      const users = await getChatUsers();
      setEmailValidation(prev => ({
        ...prev,
        availableUsers: users
      }));
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  // Enhanced particles for background
  React.useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 15,
        opacity: Math.random() * 0.08 + 0.02
      });
    }
    setParticles(newParticles);
  }, []);

  // Email validation function
  const handleEmailValidation = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setEmailValidation(prev => ({
        ...prev,
        isValid: false,
        isLoading: false,
        error: "",
        userFound: false
      }));
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailValidation(prev => ({
        ...prev,
        isValid: false,
        isLoading: false,
        error: "Please enter a valid email address",
        userFound: false
      }));
      return;
    }

    setEmailValidation(prev => ({
      ...prev,
      isValid: false,
      isLoading: true,
      error: "",
      userFound: false
    }));

    try {
      const userExists = emailValidation.availableUsers.some(
        user => user.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        setEmailValidation(prev => ({
          ...prev,
          isValid: true,
          isLoading: false,
          error: "",
          userFound: true
        }));
      } else {
        setEmailValidation(prev => ({
          ...prev,
          isValid: false,
          isLoading: false,
          error: "User not found. Please check the email address.",
          userFound: false
        }));
      }
    } catch (error) {
      setEmailValidation(prev => ({
        ...prev,
        isValid: false,
        isLoading: false,
        error: "Unable to verify email. Please try again.",
        userFound: false
      }));
    }
  };

  // Debounced email validation
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      if (toEmail) {
        handleEmailValidation(toEmail);
      } else {
        setEmailValidation(prev => ({
          ...prev,
          isValid: false,
          isLoading: false,
          error: "",
          userFound: false
        }));
      }
    }, 600);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [toEmail]);

  // Filter available users for suggestions
  const filteredUsers = emailValidation.availableUsers
    .filter(user =>
      user.email.toLowerCase().includes(toEmail.toLowerCase()) &&
      user.email.toLowerCase() !== toEmail.toLowerCase()
    )
    .slice(0, 3);

  const transferMutation = useMutation({
    mutationFn: transfer,
    onSuccess: (data) => {
      console.log("Transfer Success:", data);
      qc.invalidateQueries({ queryKey: ["wallet"] });
      setShowPinModal(false);
      setPin("");
      
      setAnimationStage(1);
      setShowSuccess(true);
      
      setTimeout(() => setAnimationStage(2), 600);
      setTimeout(() => setAnimationStage(3), 1200);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 3000);
    },
    onError: (error) => {
      console.error("Transfer Error:", error);
      const errorMsg = error?.response?.data?.detail || "Transfer failed. Please try again.";
      setPinError(errorMsg);
      setPin("");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!toEmail || !amount) {
      setPinError("Email and amount are required");
      return;
    }

    if (!emailValidation.userFound) {
      setPinError("Please enter a valid recipient email");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setPinError("Please enter a valid amount");
      return;
    }

    setPinError("");
    setShowPinModal(true);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setPinError("Please enter 4-digit PIN");
      return;
    }

    try {
      await transferMutation.mutateAsync({ 
        to_email: toEmail, 
        amount: parseFloat(amount),
        pin: pin
      });
    } catch (error) {
      console.error("Error:", error);
      setPinError(error?.response?.data?.detail || "Transaction failed. Please try again.");
      setPin("");
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    if (pinError) setPinError("");
  };

  const presetAmounts = [100, 500, 1000, 2000, 5000];
  const isSelfTransfer = currentUserEmail && toEmail.toLowerCase().trim() === currentUserEmail.toLowerCase().trim();

  // Professional Color Scheme
  const colors = {
    background: {
      primary: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E1B4B 100%)",
      secondary: "rgba(30, 41, 59, 0.95)",
      card: "rgba(30, 41, 59, 0.7)",
      modal: "rgba(15, 23, 42, 0.95)"
    },
    border: {
      primary: "rgba(51, 65, 85, 0.5)",
      secondary: "rgba(71, 85, 105, 0.3)",
      accent: "rgba(99, 102, 241, 0.4)"
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
      accent: "#60A5FA"
    },
    state: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6"
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.background.primary,
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
            background: `radial-gradient(circle, rgba(59, 130, 246, ${particle.opacity}) 0%, transparent 70%)`,
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
          radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.8) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(30, 27, 75, 0.6) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(51, 65, 85, 0.4) 0%, transparent 50%)
        `,
        animation: "backgroundShift 15s ease-in-out infinite alternate",
        pointerEvents: "none"
      }} />

      {/* Main Content */}
      <div style={{ 
        position: "relative", 
        zIndex: 2,
        maxWidth: "480px",
        margin: "0 auto",
        background: colors.background.secondary,
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: `1px solid ${colors.border.primary}`,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 100px rgba(30, 27, 75, 0.3)",
        overflow: "hidden"
      }}>
        
        {/* Enhanced Header Section */}
        <div style={{
          padding: "32px 32px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)",
          color: colors.text.primary,
          position: "relative",
          borderBottom: `1px solid ${colors.border.primary}`
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
              background: "rgba(51, 65, 85, 0.6)",
              border: `1px solid ${colors.border.secondary}`,
              borderRadius: "12px",
              color: colors.text.secondary,
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(71, 85, 105, 0.8)";
              e.target.style.color = colors.text.primary;
              e.target.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(51, 65, 85, 0.6)";
              e.target.style.color = colors.text.secondary;
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
            background: "rgba(51, 65, 85, 0.6)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            backdropFilter: "blur(10px)",
            border: `1px solid ${colors.border.secondary}`,
            animation: "pulse 3s infinite"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: colors.text.accent }}>
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 12L12 8L8 12M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            marginBottom: "8px", 
            background: "linear-gradient(135deg, #F1F5F9, #94A3B8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Send Money
          </h1>
          
          <p style={{ 
            color: colors.text.secondary,
            fontSize: "16px",
            fontWeight: "600",
            margin: 0
          }}>
            {contact?.email ? `Transfer to ${contact.email}` : "Secure money transfer"}
          </p>
        </div>

        {/* Enhanced Form Section */}
        <div style={{ padding: "32px" }}>
          
          {/* Recipient Card */}
          <div style={{
            background: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            backdropFilter: "blur(15px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.3)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                background: "rgba(51, 65, 85, 0.6)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.text.accent
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <label style={{
                fontSize: "18px",
                fontWeight: "700",
                color: colors.text.primary
              }}>
                Recipient Email
              </label>
            </div>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="Enter recipient's email address"
              style={{
                width: "100%",
                padding: "16px",
                background: "rgba(51, 65, 85, 0.4)",
                border: emailValidation.error ? 
                  `2px solid ${colors.state.error}` : 
                  emailValidation.userFound ? 
                  `2px solid ${colors.state.success}` : 
                  `2px solid ${colors.border.secondary}`,
                borderRadius: "12px",
                fontSize: "16px",
                color: colors.text.primary,
                fontWeight: "500",
                transition: "all 0.3s ease"
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(71, 85, 105, 0.6)";
                e.target.style.borderColor = colors.border.accent;
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(51, 65, 85, 0.4)";
              }}
              required
            />
            
            {/* Email Validation Status */}
            {toEmail && (
              <div style={{
                marginTop: "12px",
                minHeight: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}>
                {emailValidation.isLoading && (
                  <>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid transparent",
                      borderTop: `2px solid ${colors.text.accent}`,
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    <span style={{ color: colors.text.accent }}>Checking user...</span>
                  </>
                )}
                {emailValidation.error && !emailValidation.isLoading && (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.state.error }}>
                      <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: colors.state.error }}>{emailValidation.error}</span>
                  </>
                )}
                {emailValidation.userFound && !emailValidation.isLoading && (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.state.success }}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ color: colors.state.success }}>User verified! Ready to send</span>
                  </>
                )}
              </div>
            )}

            {/* User Suggestions */}
            {toEmail && filteredUsers.length > 0 && !emailValidation.userFound && (
              <div style={{
                marginTop: "12px",
                background: "rgba(51, 65, 85, 0.4)",
                border: `1px solid ${colors.border.secondary}`,
                borderRadius: "12px",
                padding: "12px"
              }}>
                <div style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: colors.text.secondary,
                  marginBottom: "8px"
                }}>
                  Did you mean?
                </div>
                {filteredUsers.map((user, index) => (
                  <div
                    key={user.email}
                    onClick={() => {
                      setToEmail(user.email);
                      handleEmailValidation(user.email);
                    }}
                    style={{
                      padding: "10px 12px",
                      background: "rgba(71, 85, 105, 0.4)",
                      border: `1px solid ${colors.border.secondary}`,
                      borderRadius: "8px",
                      marginBottom: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: colors.text.primary
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(99, 102, 241, 0.2)";
                      e.target.style.borderColor = colors.border.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(71, 85, 105, 0.4)";
                      e.target.style.borderColor = colors.border.secondary;
                    }}
                  >
                    {user.email}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amount Card */}
          <div style={{
            background: colors.background.card,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            backdropFilter: "blur(15px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.3)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                background: "rgba(51, 65, 85, 0.6)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.text.accent
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <label style={{
                fontSize: "18px",
                fontWeight: "700",
                color: colors.text.primary
              }}>
                Amount
              </label>
            </div>
            
            <div style={{
              position: "relative",
              marginBottom: "24px"
            }}>
              <span style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
                fontWeight: "700",
                color: colors.text.accent,
                zIndex: 2
              }}>
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="1"
                step="0.01"
                style={{
                  width: "100%",
                  padding: "18px 18px 18px 45px",
                  background: "rgba(51, 65, 85, 0.4)",
                  border: `2px solid ${colors.border.secondary}`,
                  borderRadius: "14px",
                  fontSize: "18px",
                  color: colors.text.primary,
                  fontWeight: "600",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(71, 85, 105, 0.6)";
                  e.target.style.borderColor = colors.border.accent;
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(51, 65, 85, 0.4)";
                  e.target.style.borderColor = colors.border.secondary;
                }}
                required
              />
            </div>

            {/* Enhanced Quick Amounts */}
            <div style={{ marginTop: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: colors.text.secondary,
                marginBottom: "16px"
              }}>
                Quick Select
              </label>
              <div style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}>
                {presetAmounts.map((preset, index) => (
                  <button
                    key={preset}
                    type="button"
                    onMouseEnter={() => setIsHovering(`preset-${index}`)}
                    onMouseLeave={() => setIsHovering(null)}
                    onClick={() => setAmount(preset.toString())}
                    style={{
                      flex: "1",
                      minWidth: "80px",
                      padding: "14px 12px",
                      background: amount === preset.toString() ? 
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(30, 27, 75, 0.6))" : 
                        "rgba(51, 65, 85, 0.6)",
                      border: amount === preset.toString() ? 
                        `1px solid ${colors.border.accent}` : 
                        `1px solid ${colors.border.secondary}`,
                      borderRadius: "14px",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: amount === preset.toString() ? colors.text.primary : colors.text.secondary,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: isHovering === `preset-${index}` ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)",
                      boxShadow: amount === preset.toString() ? 
                        `0 8px 25px ${colors.border.accent}` : 
                        "0 4px 12px rgba(0,0,0,0.2)"
                    }}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Self Transfer Warning */}
          {isSelfTransfer && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "18px",
              background: "rgba(245, 158, 11, 0.1)",
              border: `1px solid rgba(245, 158, 11, 0.3)`,
              borderRadius: "14px",
              marginBottom: "20px",
              animation: "fadeIn 0.5s ease"
            }}>
              <div style={{
                color: colors.state.warning,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}>
                <div style={{
                  color: colors.state.warning,
                  fontSize: "14px",
                  fontWeight: "700"
                }}>
                  Self Transfer
                </div>
                <div style={{
                  color: colors.text.secondary,
                  fontSize: "13px",
                  fontWeight: "500"
                }}>
                  You're sending money to your own account
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Send Button */}
          <button 
            onClick={handleSubmit}
            disabled={!amount || !toEmail || !emailValidation.userFound}
            style={{
              width: "100%",
              padding: "20px",
              background: !amount || !toEmail || !emailValidation.userFound ? 
                "rgba(51, 65, 85, 0.6)" : 
                isSelfTransfer ? 
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 0.8))" :
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(30, 27, 75, 0.8))",
              color: colors.text.primary,
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: (!amount || !toEmail || !emailValidation.userFound) ? "not-allowed" : "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: (!amount || !toEmail || !emailValidation.userFound) ? 
                "none" : 
                isSelfTransfer ?
                  `0 12px 32px rgba(245, 158, 11, 0.4)` :
                  `0 12px 32px rgba(59, 130, 246, 0.4)`
            }}
            onMouseEnter={(e) => {
              if (amount && toEmail && emailValidation.userFound) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = isSelfTransfer ?
                  "0 16px 40px rgba(245, 158, 11, 0.6)" :
                  "0 16px 40px rgba(59, 130, 246, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (amount && toEmail && emailValidation.userFound) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = isSelfTransfer ?
                  "0 12px 32px rgba(245, 158, 11, 0.4)" :
                  "0 12px 32px rgba(59, 130, 246, 0.4)";
              }
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              {!emailValidation.userFound && toEmail ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Check Email First
                </>
              ) : isSelfTransfer ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 17L16 7M8 7H16V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Transfer to Self
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send Money
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced PIN Modal */}
      {showPinModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.background.modal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
          backdropFilter: "blur(10px)",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: colors.background.secondary,
            padding: "36px 32px",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "420px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            border: `1px solid ${colors.border.primary}`,
            position: "relative",
            animation: "scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(30, 27, 75, 0.3))",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                margin: "0 auto 20px",
                boxShadow: "0 16px 32px rgba(0,0,0,0.4)",
                animation: "pulse 3s infinite",
                border: `1px solid ${colors.border.secondary}`
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: colors.text.accent }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: "26px", 
                fontWeight: "800", 
                marginBottom: "8px", 
                color: colors.text.primary
              }}>
                Security Verification
              </h3>
              <p style={{ 
                color: colors.text.secondary, 
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: "1.5",
                marginBottom: "20px"
              }}>
                Please enter your 4-digit PIN to confirm the transfer
              </p>
              <div style={{
                background: colors.background.card,
                padding: "16px",
                borderRadius: "14px",
                border: `1px solid ${colors.border.secondary}`
              }}>
                <div style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: colors.text.primary,
                  marginBottom: "4px"
                }}>
                  ₹{parseFloat(amount).toLocaleString()}
                </div>
                <div style={{
                  fontSize: "14px",
                  color: colors.text.secondary,
                  fontWeight: "600"
                }}>
                  to {toEmail}
                </div>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} style={{ marginTop: "8px" }}>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="password"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength={4}
                  placeholder="Enter PIN"
                  style={{
                    width: "100%",
                    padding: "20px",
                    border: pinError ? 
                      `2px solid ${colors.state.error}` : 
                      `2px solid ${colors.border.accent}`,
                    borderRadius: "16px",
                    fontSize: "20px",
                    textAlign: "center",
                    letterSpacing: "20px",
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    boxSizing: "border-box",
                    outline: "none",
                    fontWeight: "700",
                    transition: "all 0.3s ease",
                    boxShadow: pinError ? 
                      `0 0 25px ${colors.state.error}` : 
                      "0 8px 24px rgba(0,0,0,0.3)"
                  }}
                  autoFocus
                  disabled={transferMutation.isPending}
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
                        `2px solid ${colors.state.error}` : 
                        `2px solid ${colors.border.accent}`,
                      background: pin.length > index ? 
                        (pinError ? colors.state.error : colors.text.accent) : 
                        "transparent",
                      transition: "all 0.3s ease",
                      boxShadow: pin.length > index ? 
                        (pinError ? 
                          `0 0 15px ${colors.state.error}` : 
                          `0 0 15px ${colors.border.accent}`) : 
                        "none",
                      animation: pin.length > index ? "pulse 2s infinite" : "none"
                    }}
                  />
                ))}
              </div>

              {pinError && (
                <div style={{ 
                  color: colors.state.error, 
                  textAlign: "center", 
                  margin: "20px 0",
                  fontSize: "14px",
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "14px",
                  fontWeight: "600",
                  border: `1px solid rgba(239, 68, 68, 0.3)`,
                  animation: "shake 0.5s ease",
                  lineHeight: "1.5"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: "8px", display: "inline-block" }}>
                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {pinError}
                </div>
              )}

              <div style={{ display: "flex", gap: "14px" }}>
                <button 
                  type="button" 
                  style={{ 
                    flex: 1,
                    padding: "16px",
                    background: colors.background.card,
                    color: colors.text.secondary,
                    border: `1px solid ${colors.border.secondary}`,
                    borderRadius: "14px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => {
                    setShowPinModal(false);
                    setPin("");
                    setPinError("");
                  }}
                  disabled={transferMutation.isPending}
                  onMouseEnter={(e) => {
                    if (!transferMutation.isPending) {
                      e.target.style.background = "rgba(71, 85, 105, 0.6)";
                      e.target.style.color = colors.text.primary;
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!transferMutation.isPending) {
                      e.target.style.background = colors.background.card;
                      e.target.style.color = colors.text.secondary;
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
                    background: pin.length !== 4 || transferMutation.isPending ? 
                      "rgba(51, 65, 85, 0.6)" : 
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(30, 27, 75, 0.8))",
                    color: colors.text.primary,
                    border: "none",
                    borderRadius: "14px",
                    cursor: (pin.length !== 4 || transferMutation.isPending) ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxShadow: (pin.length !== 4 || transferMutation.isPending) ? 
                      "none" : 
                      "0 12px 32px rgba(0,0,0,0.3)"
                  }}
                  disabled={pin.length !== 4 || transferMutation.isPending}
                  onMouseEnter={(e) => {
                    if (pin.length === 4 && !transferMutation.isPending) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pin.length === 4 && !transferMutation.isPending) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
                    }
                  }}
                >
                  {transferMutation.isPending ? (
                    <>
                      <div style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid transparent",
                        borderTop: `2px solid ${colors.text.primary}`,
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        display: "inline-block",
                        marginRight: "8px"
                      }} />
                      Processing...
                    </>
                  ) : (
                    'Confirm Transfer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Success Animation */}
      {showSuccess && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.background.modal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(15px)",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: colors.background.secondary,
            padding: "48px 40px",
            borderRadius: "24px",
            maxWidth: "440px",
            width: "90%",
            textAlign: "center",
            border: `1px solid ${colors.border.primary}`,
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            animation: "successScale 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
              transition: "all 0.6s ease",
              background: animationStage >= 2 ? 
                "rgba(16, 185, 129, 0.2)" : 
                colors.background.card,
              border: animationStage >= 2 ? 
                `1px solid ${colors.state.success}` : 
                `1px solid ${colors.border.secondary}`,
              animation: animationStage >= 2 ? "successBounce 0.6s ease-out" : "none"
            }}>
              {animationStage >= 2 ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: colors.state.success }}>
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid transparent",
                  borderTop: `3px solid ${colors.text.accent}`,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
              )}
            </div>
            
            <h3 style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "12px",
              color: colors.text.primary
            }}>
              {animationStage >= 2 ? 'Transfer Successful!' : 'Processing...'}
            </h3>
            
            <p style={{
              fontSize: "17px",
              color: colors.text.secondary,
              marginBottom: "32px",
              fontWeight: "600",
              lineHeight: "1.5"
            }}>
              {animationStage >= 2 ? (
                `₹${parseFloat(amount).toLocaleString()} ${isSelfTransfer ? 'transferred to your account' : `sent to ${toEmail}`}`
              ) : (
                'Your transaction is being processed'
              )}
            </p>

            <div style={{
              marginTop: "28px"
            }}>
              <div style={{
                width: "100%",
                height: "6px",
                background: colors.background.card,
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${colors.state.success}, #10B981)`,
                  animation: "progressFill 2.5s ease-out forwards",
                  borderRadius: "3px"
                }} />
              </div>
            </div>
          </div>
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

          @keyframes successScale {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @keyframes successBounce {
            0%, 20%, 53%, 80%, 100% { transform: scale(1); }
            40%, 43% { transform: scale(1.1); }
            70% { transform: scale(1.05); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes progressFill {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }

          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </div>
  );
};

export default SendMoney;