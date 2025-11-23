# WalletPay — Digital Wallet System with Realtime Messaging

A modern, full-stack **digital wallet + realtime chat platform** built with **FastAPI**, **PostgreSQL**, **React**, and **WebSockets**.  
WalletPay implements secure authentication, wallet operations, realtime messaging, and cloud-optimized deployment using **Vercel**, **Render**, and **NeonDB**.

---

## 🚀 System Architecture

Frontend (React + Vite) → Vercel
Backend API (FastAPI + JWT Auth) → Render
Realtime Chat (WebSocket) → FastAPI WS Router
Database (PostgreSQL) → Neon Cloud

yaml
Copy code

---

## 🌍 Production Deployments

| Component | URL |
|----------|-----|
| **Frontend Web App** | https://payment-wallet-chat-frontend.vercel.app |
| **Backend REST API** | https://payment-wallet-chat-backend.onrender.com |
| **API Documentation (Swagger UI)** | https://payment-wallet-chat-backend.onrender.com/docs |

> Replace image paths with your own repository assets.

---

# ✨ Core Features

## 🔐 Authentication & Security
- Email-based signup & login  
- JWT access & refresh tokens  
- Secure PIN-based operations  
- Password & PIN verification APIs  
- Protected routes via dependency injection  

---

## 💰 Wallet Operations
- Add money to wallet  
- Transfer funds between users  
- Paginated transaction history  
- Track transaction types & status  
- Full server-side validation  

---

## 💬 Realtime Messaging
- Authenticated WebSocket channel  
- Two-way realtime chat  
- Online/offline presence tracking  
- Read & delivery receipts  
- Pending messages auto-sent after reconnection  
- Chat history retrieval  

---

## ⚙️ Reliability & Stability
- Automatic WebSocket reconnection  
- Optimistic UI updates  
- Server-side persistence  
- Fully async DB operations  

---

# 🏗️ Technology Stack

## Frontend
- React (Vite)  
- React Query  
- Zustand  
- Axios  
- WebSockets  

## Backend
- FastAPI  
- SQLAlchemy Async ORM  
- Pydantic validation  
- JWT authentication  
- WebSocket router  

## Infrastructure
- **Vercel** (Frontend)  
- **Render** (Backend)  
- **NeonDB** (Managed PostgreSQL)  

---

# 🔧 Environment Configuration

## Frontend `.env`
VITE_API_URL=https://payment-wallet-chat-backend.onrender.com/api/v1
VITE_WS_URL=wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws

shell
Copy code

## Backend `.env`
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<db>
JWT_SECRET_KEY=<your-secret>
JWT_REFRESH_SECRET_KEY=<your-refresh-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=30

yaml
Copy code

---

# 📡 API Documentation Summary

## Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login & obtain access tokens |
| POST | `/auth/refresh` | Refresh JWT access token |

---

## Wallet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet/me` | Get wallet details |
| POST | `/wallet/add-money` | Add money to wallet |
| POST | `/wallet/transfer` | Transfer funds |
| GET | `/wallet/history` | Paginated history |

---

## Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/` | Fetch profile |
| PUT | `/profile/` | Update profile |
| POST | `/profile/verify-pin` | Verify transaction PIN |
| POST | `/profile/verify-password` | Verify password |

---

## Messaging (HTTP)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chat/users` | List chat-eligible users |
| GET | `/chat/history/{id}` | Retrieve chat history |
| GET | `/chat/all-messages` | Fetch all messages |
| PUT | `/chat/messages/{id}/read` | Mark as read |

---

## WebSocket Messaging

### WebSocket URL Format
wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws/{user_email}?token=<jwt>&user_id=<id>

yaml
Copy code

### Capabilities
- Realtime messaging  
- Delivery confirmations  
- Read receipts  
- Presence tracking  
- Auto-delivery of pending messages  

---

# 🛠️ Local Development

## Frontend
```bash
cd frontend
npm install
npm run dev
Backend
bash
Copy code
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
🌐 Deployment Guide
Frontend (Vercel)
Import GitHub Repository

Add Environment Variables

Build Command:

arduino
Copy code
npm run build
Output Directory:

nginx
Copy code
dist
Backend (Render)
Deploy as Web Service

Add Env Variables

Start Command:

nginx
Copy code
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4
Connect NeonDB PostgreSQL

📁 Project Structure
arduino
Copy code
backend/
│── app/
│   ├── api/
│   ├── core/
│   ├── crud/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   └── services/
│── Dockerfile

frontend/
│── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── context/
│── vite.config.js
📜 License
Licensed under the MIT License.
