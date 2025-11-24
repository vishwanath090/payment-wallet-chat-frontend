import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    pin: ""
  });

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for pin
    if (name === "pin") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, pin: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      await api.post("/auth/signup", {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        pin: formData.pin
      });

      setMsg("success: Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(
        "error: " +
          (err?.response?.data?.detail || "Signup failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(-45deg, #0f0f0f, #1a1a1a, #2d1b69, #0f0f23)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite"
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
            50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.6); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="glass-card"
        style={{
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          background: "rgba(30, 30, 46, 0.7)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          padding: "40px 32px",
          border: "1px solid rgba(102, 126, 234, 0.2)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.8s ease-out",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
          animation: "float 6s ease-in-out infinite",
          zIndex: 0
        }} />
        
        <div style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
          animation: "float 4s ease-in-out infinite 1s",
          zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: "32px", animation: "slideIn 0.6s ease-out 0.2s both" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #667eea, #ec4899)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                margin: "0 auto 16px",
                animation: "glow 3s ease-in-out infinite, float 4s ease-in-out infinite",
                transform: "translateY(0px)"
              }}
            >
              👤
            </div>

            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              marginBottom: "8px", 
              color: "#f1f5f9",
              background: "linear-gradient(135deg, #667eea, #ec4899)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Join WalletPay
            </h1>

            <p style={{ color: "#94a3b8", fontSize: "14px", letterSpacing: "0.5px" }}>
              Create your digital wallet
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} style={{ animation: "slideIn 0.6s ease-out 0.4s both" }}>
            
            {/* Full Name */}
            <div style={{ marginBottom: "20px", animation: "slideIn 0.6s ease-out 0.5s both" }}>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                autoComplete="off"
                spellCheck="false"
                style={{ 
                  textAlign: "center",
                  width: "100%",
                  padding: "14px 20px",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  borderRadius: "16px",
                  fontSize: "16px",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#f1f5f9",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 20px rgba(102, 126, 234, 0.3)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "scale(1)";
                }}
                placeholderTextColor="#94a3b8"
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "20px", animation: "slideIn 0.6s ease-out 0.6s both" }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                autoComplete="email"
                spellCheck="false"
                style={{ 
                  textAlign: "center",
                  width: "100%",
                  padding: "14px 20px",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  borderRadius: "16px",
                  fontSize: "16px",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#f1f5f9",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 20px rgba(102, 126, 234, 0.3)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "scale(1)";
                }}
                placeholderTextColor="#94a3b8"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px", animation: "slideIn 0.6s ease-out 0.7s both" }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                required
                autoComplete="new-password"
                spellCheck="false"
                style={{ 
                  textAlign: "center",
                  width: "100%",
                  padding: "14px 20px",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  borderRadius: "16px",
                  fontSize: "16px",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#f1f5f9",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 20px rgba(102, 126, 234, 0.3)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "scale(1)";
                }}
                placeholderTextColor="#94a3b8"
              />
            </div>

            {/* PIN */}
            <div style={{ marginBottom: "24px", animation: "slideIn 0.6s ease-out 0.8s both" }}>
              <input
                type="password"
                name="pin"
                value={formData.pin}
                maxLength={4}
                onChange={handleChange}
                placeholder="4-digit Security PIN"
                required
                autoComplete="off"
                inputMode="numeric"
                style={{
                  textAlign: "center",
                  letterSpacing: "12px",
                  width: "100%",
                  padding: "14px 20px",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  borderRadius: "16px",
                  fontSize: "18px",
                  backgroundColor: "rgba(30, 41, 59, 0.6)",
                  color: "#f1f5f9",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 20px rgba(102, 126, 234, 0.3)";
                  e.target.style.transform = "scale(1.02)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "scale(1)";
                }}
                placeholderTextColor="#94a3b8"
              />
              <small
                style={{
                  color: "#94a3b8",
                  marginTop: "12px",
                  display: "block",
                  fontSize: "12px",
                  letterSpacing: "0.5px"
                }}
              >
                This PIN secures your transactions
              </small>
            </div>

            {/* Message */}
            {msg && (
              <div
                style={{
                  background: msg.includes("success")
                    ? "rgba(16, 185, 129, 0.15)"
                    : "rgba(239, 68, 68, 0.15)",
                  color: msg.includes("success") ? "#10b981" : "#ef4444",
                  padding: "16px",
                  borderRadius: "16px",
                  marginBottom: "20px",
                  border: `1px solid ${
                    msg.includes("success")
                      ? "rgba(16, 185, 129, 0.3)"
                      : "rgba(239, 68, 68, 0.3)"
                  }`,
                  fontSize: "14px",
                  backdropFilter: "blur(10px)",
                  animation: "slideIn 0.5s ease-out"
                }}
              >
                {msg.replace(/^(success|error):\s*/, "")}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              style={{ 
                width: "100%",
                padding: "16px 20px",
                background: "linear-gradient(135deg, #667eea, #ec4899)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "16px",
                backdropFilter: "blur(10px)",
                animation: "slideIn 0.6s ease-out 0.9s both",
                transform: isHovered ? "scale(1.05) translateY(-2px)" : "scale(1)",
                boxShadow: isHovered 
                  ? "0 15px 30px rgba(102, 126, 234, 0.4)" 
                  : "0 8px 25px rgba(102, 126, 234, 0.3)"
              }}
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isLoading ? "⏳ Creating Account..." : "🎉 Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "24px", animation: "slideIn 0.6s ease-out 1s both" }}>
            <p style={{ color: "#94a3b8", fontSize: "14px", letterSpacing: "0.5px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  background: "linear-gradient(135deg, #667eea, #ec4899)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
                onMouseEnter={(e) => e.target.style.filter = "brightness(1.2)"}
                onMouseLeave={(e) => e.target.style.filter = "brightness(1)"}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;