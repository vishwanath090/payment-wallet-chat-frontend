// src/components/PinModal.jsx
import React, { useState } from "react";
import { verifyPin } from "../api/auth";

const PinModal = ({ onVerified }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      await verifyPin(pin);
      onVerified(); // Pass success
    } catch (err) {
      setError("Invalid PIN");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Enter 4-digit PIN</h3>
        <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" maxLength={4} />
        <button onClick={handleVerify}>Verify PIN</button>
        {error && <p>{error}</p>}
      </div>

      {/* Modal Styles */}
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0, 0, 0, 0.5);
        }
        .modal-box {
          background: white; padding: 20px; border-radius: 8px; text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PinModal;
