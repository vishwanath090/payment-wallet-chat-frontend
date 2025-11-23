# WalletPay — Digital Wallet System with Realtime Messaging

WalletPay is a full-stack digital wallet and realtime communication platform built using FastAPI, PostgreSQL, React, and WebSockets.  
It provides secure authentication, wallet operations, realtime chat, and cloud-ready deployments through Vercel, Render, and Neon.  
The project follows modern engineering standards and demonstrates a scalable, production-grade architecture.

---
## Deployment Architecture Images

Below are placeholders for your deployment architecture visuals.  
Replace the image paths with your actual screenshots or diagrams.

### Frontend Deployment (Vercel)
![Frontend Deployment](./images/frontend-deployment.png)

### Backend Deployment (Render)
![Backend Deployment](./images/backend-deployment.png)

### Database Deployment (Neon PostgreSQL)
![Database Deployment](./images/database-deployment.png)

---
## Production Deployments

| Component | URL |
|----------|-----|
| Frontend Application | https://payment-wallet-chat-frontend.vercel.app |
| Backend REST API | https://payment-wallet-chat-backend.onrender.com |
| API Documentation (Swagger UI) | https://payment-wallet-chat-backend.onrender.com/docs |

---

# Core Features

## Authentication & Security
- Email-based registration and login  
- Secure JWT access and refresh tokens  
- PIN-based protected actions  
- Password and PIN verification endpoints  
- Fully protected routes via dependency injection  

---

## Wallet Operations
- Add funds to wallet  
- Transfer money between users  
- Paginated transaction history
- Status and transaction-type tracking with Graphical analysis
- Strict server-side validation  

---

## Realtime Messaging
- Authenticated WebSocket channel  
- Two-way messaging between users  
- Presence tracking (online/offline)  
- Delivery and read receipts  
- Pending message delivery after reconnection  
- Chat history retrieval  

---

## Reliability & Stability
- Automatic WebSocket reconnection  
- Optimistic UI updates  
- Server-validated persistence  
- Asynchronous database operations  

---

# Technology Stack

## Frontend
- React (Vite)  
- React Query  
- Zustand  
- Axios  
- Native WebSockets  

## Backend
- FastAPI  
- SQLAlchemy (Async ORM)  
- Pydantic schemas  
- JWT authentication  
- WebSocket router  

## Infrastructure
- Vercel (Frontend hosting)  
- Render (Backend hosting)  
- Neon (Managed PostgreSQL)  

---

# Environment Configuration

## Frontend `.env`
VITE_API_URL=https://payment-wallet-chat-backend.onrender.com/api/v1
VITE_WS_URL=wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws


## Backend `.env`
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<db>
JWT_SECRET_KEY=<your-secret>
JWT_REFRESH_SECRET_KEY=<your-refresh-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=30


---

# API Documentation Summary

## Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/signup | Register a new user |
| POST | /auth/login | Authenticate and obtain tokens |
| POST | /auth/refresh | Refresh the access token |

---

## Wallet Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /wallet/me | Retrieve wallet details |
| POST | /wallet/add-money | Add funds |
| POST | /wallet/transfer | Transfer money to another user |
| GET | /wallet/history | Paginated transaction history |

---

## Profile Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /profile/ | Retrieve profile |
| PUT | /profile/ | Update profile |
| POST | /profile/verify-pin | Verify transaction PIN |
| POST | /profile/verify-password | Verify password |

---

## Messaging Endpoints (HTTP)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /chat/users | List all users available for chat |
| GET | /chat/history/{identifier} | Retrieve two-way chat history |
| GET | /chat/all-messages | Fetch all messages |
| PUT | /chat/messages/{id}/read | Mark message as read |

---

## WebSocket Messaging

### WebSocket URL Format
wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws/{user_email}?token=<jwt>&user_id=<id>


### Capabilities
- Realtime message send/receive  
- Delivery confirmations  
- Read receipts  
- Presence tracking  
- Automatic delivery of pending messages  

---

# Local Development Setup

## Frontend Setup
cd frontend
npm install
npm run dev


## Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload


---

# Deployment Guide

## Frontend Deployment (Vercel)
1. Import the GitHub repository  
2. Configure environment variables  
3. Build command:
npm run build
4. Output directory:
dist
---

## Backend Deployment (Render)
1. Deploy as a Web Service  
2. Add environment variables  
3. Start command:
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4

4. Connect Neon PostgreSQL database  

---

# Project Structure

backend/
│── app/
│ ├── api/
│ ├── core/
│ ├── crud/
│ ├── db/
│ ├── models/
│ ├── schemas/
│ └── services/
│── Dockerfile

frontend/
│── src/
│ ├── api/
│ ├── components/
│ ├── pages/
│ ├── context/
│── vite.config.js

---

# License
This project is licensed under the MIT License.
