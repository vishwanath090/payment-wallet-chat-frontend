import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="login-container">
      {/* Soft background blobs */}
      <div className="background-elements">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
      </div>

      <div className="login-content">
        <div className="glass-card">
          {/* Brand / Logo */}
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-orb">
                <div className="logo-inner">
                  <span className="logo-mark">WP</span>
                </div>
              </div>
            </div>
            <h1 className="app-title">WalletPay</h1>
            <p className="app-subtitle">Secure Digital Wallet</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div
              className={`form-group ${
                isFocused.email ? "focused" : ""
              } ${email ? "has-value" : ""}`}
            >
              <div className="input-wrapper">
                <div className="input-icon">
                  {/* mail icon */}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="icon-svg"
                  >
                    <path
                      d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2.2v-.1l8 5 8-5v.1L12 12.5 4 7.2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  placeholder=" "
                  required
                />
                <label className="floating-label">Email Address</label>
                <div className="input-highlight" />
              </div>
            </div>

            {/* Password */}
            <div
              className={`form-group ${
                isFocused.password ? "focused" : ""
              } ${password ? "has-value" : ""}`}
            >
              <div className="input-wrapper">
                <div className="input-icon">
                  {/* lock icon */}
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="icon-svg"
                  >
                    <path
                      d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1zm2 0h6V8a3 3 0 0 0-6 0v2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  placeholder=" "
                  required
                />
                <label className="floating-label">Password</label>
                <div className="input-highlight" />
              </div>
            </div>

            {/* Forgot password → new page */}
            <div className="forgot-row">
              <button
                type="button"
                className="forgot-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="error-message">
                <div className="error-icon">!</div>
                <span>{error}</span>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              <span className="btn-content">
                <span className="btn-text">
                  {isLoading ? "Signing In..." : "Sign In"}
                </span>
                <span className="btn-arrow">→</span>
              </span>
              <div className="btn-shine" />
              <div className="btn-loader">
                <div className="loader-spinner" />
              </div>
            </button>
          </form>

          {/* Sign up */}
          <div className="signup-section">
            <div className="divider">
              <span>New to WalletPay?</span>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="signup-btn"
              type="button"
            >
              Create your account
              <span className="signup-arrow">↗</span>
            </button>
          </div>
        </div>
      </div>

      <div className="login-footer">
        <p>Secure • Fast • Reliable</p>
      </div>
    </div>
  );
};

export default Login;
