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
        padding: "20px"
      }}
    >
      <div className="glass-card"
        style={{
          maxWidth: "400px",
          width: "100%",
          textAlign: "center"
        }}
      >

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, var(--secondary), #34D399)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              margin: "0 auto 16px",
              boxShadow: "0 8px 32px rgba(6, 214, 160, 0.3)"
            }}
          >
            👤
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
            Join WalletPay
          </h1>

          <p style={{ color: "var(--text-secondary)" }}>
            Create your digital wallet
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup}>
          
          {/* Full Name */}
          <div className="form-group">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Full Name"
              required
              autoComplete="off"
              spellCheck="false"
              style={{ textAlign: "center" }}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Email Address"
              required
              autoComplete="email"
              spellCheck="false"
              style={{ textAlign: "center" }}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create Password"
              required
              autoComplete="new-password"
              spellCheck="false"
              style={{ textAlign: "center" }}
            />
          </div>

          {/* PIN */}
          <div className="form-group">
            <input
              type="password"
              name="pin"
              value={formData.pin}
              maxLength={4}
              onChange={handleChange}
              placeholder="4-digit Security PIN"
              className="form-input"
              required
              autoComplete="off"
              inputMode="numeric"
              style={{
                textAlign: "center",
                letterSpacing: "8px"
              }}
            />
            <small
              style={{
                color: "var(--text-secondary)",
                marginTop: "8px",
                display: "block",
                fontSize: "12px"
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
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
                color: msg.includes("success") ? "var(--success)" : "var(--error)",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "16px",
                border: `1px solid ${
                  msg.includes("success")
                    ? "rgba(16, 185, 129, 0.2)"
                    : "rgba(239, 68, 68, 0.2)"
                }`
              }}
            >
              {msg.replace(/^(success|error):\s*/, "")}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            {isLoading ? "⏳ Creating Account..." : "🎉 Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--primary-light)",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
