import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const API_BASE = "http://localhost:8000/api/v1"; // change if needed

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/profile/reset-password-with-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          pin,
          new_password: newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Reset failed.");
      }

      setSuccessMsg("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-background">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>

      <div className="forgot-card">
        <h2 className="forgot-title">Reset Password</h2>
        <p className="forgot-subtitle">Enter your details to reset your password</p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="forgot-group">
            <input
              type="email"
              className="forgot-input"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="forgot-label">Email Address</label>
          </div>

          <div className="forgot-group">
            <input
              type="text"
              className="forgot-input"
              placeholder=" "
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label className="forgot-label">Full Name</label>
          </div>

          <div className="forgot-group">
            <input
              type="password"
              className="forgot-input"
              placeholder=" "
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              required
            />
            <label className="forgot-label">4-Digit PIN</label>
          </div>

          <div className="forgot-group">
            <input
              type="password"
              className="forgot-input"
              placeholder=" "
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label className="forgot-label">New Password</label>
          </div>

          {errorMsg && <div className="forgot-error">⚠️ {errorMsg}</div>}
          {successMsg && <div className="forgot-success">✅ {successMsg}</div>}

          <button
            type="submit"
            className={`forgot-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            className="forgot-back"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
