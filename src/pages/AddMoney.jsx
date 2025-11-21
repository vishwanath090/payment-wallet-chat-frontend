import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addMoney } from "../api/wallet";

const AddMoney = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [isHovering, setIsHovering] = useState(null);
  const [particles, setParticles] = useState([]);

  const addMoneyMutation = useMutation({
    mutationFn: addMoney,
    onSuccess: (data) => {
      console.log("Add Money Success:", data);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
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
      console.error("Add Money Error:", error);
      const errorMsg = error?.response?.data?.detail || "Failed to add money. Please try again.";
      setPinError(errorMsg);
      setPin("");
    }
  });

  const presetAmounts = [100, 500, 1000, 2000, 5000];

  // Enhanced particles for background
  React.useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
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

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    
    if (!parsedAmount || parsedAmount <= 0) {
      setPinError("Please enter a valid amount");
      return;
    }
    
    if (parsedAmount < 10) {
      setPinError("Minimum amount is ₹10");
      return;
    }

    setShowPinModal(true);
    setPinError("");
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError("Please enter 4-digit PIN");
      return;
    }

    try {
      await addMoneyMutation.mutateAsync({ 
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

      {/* Main Content */}
      <div style={{ 
        position: "relative", 
        zIndex: 2,
        maxWidth: "480px",
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
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            Add Money
          </h1>
          
          <p style={{ 
            color: "rgba(255,255,255,0.8)",
            fontSize: "16px",
            fontWeight: "600",
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}>
            Instantly fund your wallet
          </p>
        </div>

        {/* Enhanced Form Section */}
        <div style={{ padding: "32px" }}>
          
          {/* Amount Selection Card */}
          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            backdropFilter: "blur(15px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease"
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
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.9)"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <label style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "rgba(255,255,255,0.95)"
              }}>
                Select Amount
              </label>
            </div>

            {/* Enhanced Quick Amounts */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.7)",
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
                    onClick={() => handleAmountSelect(preset)}
                    style={{
                      flex: "1",
                      minWidth: "80px",
                      padding: "14px 12px",
                      background: amount === preset.toString() ? 
                        "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))" : 
                        "rgba(255,255,255,0.08)",
                      border: amount === preset.toString() ? 
                        "1px solid rgba(99, 102, 241, 0.4)" : 
                        "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "14px",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: amount === preset.toString() ? "white" : "rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: isHovering === `preset-${index}` ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)",
                      boxShadow: amount === preset.toString() ? 
                        "0 8px 25px rgba(99, 102, 241, 0.3)" : 
                        (isHovering === `preset-${index}` ? "0 8px 20px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.2)"),
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Custom Amount */}
            <div style={{ marginTop: "24px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.9)"
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <label style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.95)"
                }}>
                  Custom Amount
                </label>
              </div>
              
              <div style={{
                position: "relative",
                marginBottom: "12px"
              }}>
                <span style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.8)",
                  zIndex: 2
                }}>
                  ₹
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  placeholder="Enter amount"
                  min="10"
                  step="1"
                  style={{
                    width: "100%",
                    padding: "18px 18px 18px 45px",
                    background: "rgba(255,255,255,0.08)",
                    border: "2px solid rgba(255,255,255,0.15)",
                    borderRadius: "14px",
                    fontSize: "16px",
                    color: "white",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)"
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.12)";
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(255,255,255,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
                textAlign: "center",
                fontWeight: "500"
              }}>
                Minimum amount: ₹10
              </div>
            </div>
          </div>

          {/* Enhanced Amount Preview */}
          {amount && (
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
              padding: "24px",
              borderRadius: "16px",
              textAlign: "center",
              marginBottom: "24px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(15px)",
              animation: "fadeIn 0.5s ease"
            }}>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "12px"
              }}>
                Ready to Add
              </div>
              <div style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "white",
                marginBottom: "16px",
                background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 4px 16px rgba(0,0,0,0.3)"
              }}>
                ₹{parseFloat(amount).toLocaleString()}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: "600"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  background: "#10B981",
                  borderRadius: "50%",
                  animation: "pulse 2s infinite"
                }}></div>
                Instant Deposit • Secure Processing
              </div>
            </div>
          )}

          {/* Enhanced Add Money Button */}
          <button 
            onClick={handleSubmit}
            disabled={!amount || addMoneyMutation.isPending}
            style={{
              width: "100%",
              padding: "20px",
              background: !amount || addMoneyMutation.isPending ? 
                "rgba(255,255,255,0.1)" : 
                "linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8))",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: !amount || addMoneyMutation.isPending ? "not-allowed" : "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: !amount || addMoneyMutation.isPending ? 
                "none" : 
                "0 12px 32px rgba(99, 102, 241, 0.4)",
              backdropFilter: "blur(15px)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              if (amount && !addMoneyMutation.isPending) {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 16px 40px rgba(99, 102, 241, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (amount && !addMoneyMutation.isPending) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 12px 32px rgba(99, 102, 241, 0.4)";
              }
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              {addMoneyMutation.isPending ? (
                <>
                  <div style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid transparent",
                    borderTop: "2px solid currentColor",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add ₹{amount || 'Money'}
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
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(40px)",
            position: "relative",
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: "26px", 
                fontWeight: "800", 
                marginBottom: "8px", 
                color: "white",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)"
              }}>
                Security Verification
              </h3>
              <p style={{ 
                color: "rgba(255,255,255,0.8)", 
                fontSize: "15px",
                fontWeight: "600",
                lineHeight: "1.5",
                marginBottom: "20px"
              }}>
                Please enter your 4-digit PIN to add money
              </p>
              <div style={{
                background: "rgba(255,255,255,0.08)",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "4px"
                }}>
                  ₹{parseFloat(amount).toLocaleString()}
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: "600"
                }}>
                  to your wallet
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
                  disabled={addMoneyMutation.isPending}
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
                  disabled={addMoneyMutation.isPending}
                  onMouseEnter={(e) => {
                    if (!addMoneyMutation.isPending) {
                      e.target.style.background = "rgba(255,255,255,0.12)";
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!addMoneyMutation.isPending) {
                      e.target.style.background = "rgba(255,255,255,0.08)";
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
                    background: pin.length !== 4 || addMoneyMutation.isPending ? 
                      "rgba(255,255,255,0.1)" : 
                      "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1))",
                    color: "white",
                    border: "none",
                    borderRadius: "14px",
                    cursor: (pin.length !== 4 || addMoneyMutation.isPending) ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxShadow: (pin.length !== 4 || addMoneyMutation.isPending) ? 
                      "none" : 
                      "0 12px 32px rgba(0,0,0,0.25)",
                    backdropFilter: "blur(10px)"
                  }}
                  disabled={pin.length !== 4 || addMoneyMutation.isPending}
                  onMouseEnter={(e) => {
                    if (pin.length === 4 && !addMoneyMutation.isPending) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pin.length === 4 && !addMoneyMutation.isPending) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)";
                    }
                  }}
                >
                  {addMoneyMutation.isPending ? (
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
                      Processing...
                    </>
                  ) : (
                    'Add Money'
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
          background: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(20px)",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            padding: "48px 40px",
            borderRadius: "32px",
            maxWidth: "440px",
            width: "90%",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
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
                "rgba(72, 187, 120, 0.2)" : 
                "rgba(255,255,255,0.1)",
              border: animationStage >= 2 ? 
                "1px solid rgba(72, 187, 120, 0.3)" : 
                "1px solid rgba(255,255,255,0.2)",
              animation: animationStage >= 2 ? "successBounce 0.6s ease-out" : "none"
            }}>
              {animationStage >= 2 ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: "#48BB78" }}>
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid transparent",
                  borderTop: "3px solid rgba(255,255,255,0.8)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
              )}
            </div>
            
            <h3 style={{
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "12px",
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}>
              {animationStage >= 2 ? 'Money Added!' : 'Processing...'}
            </h3>
            
            <p style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.8)",
              marginBottom: "32px",
              fontWeight: "600",
              lineHeight: "1.5"
            }}>
              {animationStage >= 2 ? (
                `₹${parseFloat(amount).toLocaleString()} added to your wallet`
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
                background: "rgba(255,255,255,0.1)",
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  background: "linear-gradient(135deg, #48BB78, #10B981)",
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
            50% { opacity: 0.5; }
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

export default AddMoney;