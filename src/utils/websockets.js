// src/utils/websocket.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.messageHandlers = new Set();
  }

  connect(userEmail, onMessage, onStatusChange) {
    if (this.socket) {
      this.disconnect();
    }

    const token = localStorage.getItem("token");
    const wsUrl = token 
      ? `ws://localhost:8000/api/v1/chat/ws/${encodeURIComponent(userEmail)}?token=${token}`
      : `ws://localhost:8000/api/v1/chat/ws/${encodeURIComponent(userEmail)}`;

    try {
      this.socket = new WebSocket(wsUrl);
      this.onStatusChange = onStatusChange;

      this.socket.onopen = () => {
        console.log("✅ WebSocket Connected");
        this.reconnectAttempts = 0;
        onStatusChange("connected");
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error("❌ Error parsing message:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log("🔴 WebSocket Disconnected:", event.code, event.reason);
        onStatusChange("disconnected");

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect(userEmail, onMessage, onStatusChange);
          }, this.reconnectInterval);
        }
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket Error:", error);
        onStatusChange("error");
      };

    } catch (error) {
      console.error("❌ Failed to create WebSocket:", error);
      onStatusChange("error");
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Manual disconnect");
      this.socket = null;
    }
  }

  getStatus() {
    if (!this.socket) return "disconnected";
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CLOSING:
        return "disconnecting";
      case WebSocket.CLOSED:
        return "disconnected";
      default:
        return "unknown";
    }
  }
}

export const webSocketService = new WebSocketService();