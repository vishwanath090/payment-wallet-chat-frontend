##WalletPay Platform
#Digital Wallet System with Real-time Messaging

📖 Overview
WalletPay is a full-stack digital wallet and communication platform designed with modern engineering principles. It provides secure user authentication, wallet management, financial transactions, and real-time WebSocket-based chat. The platform serves as a production-ready architecture example combining FastAPI, PostgreSQL, React, and Vercel/Render deployments.

🏗️ Architecture
text
Frontend (React + Vite) → Vercel
Backend API (FastAPI + JWT Auth) → Render
Realtime Chat (WebSocket) → FastAPI WS Router
Database (PostgreSQL) → Neon Cloud
All services communicate through secure API routes and authenticated WebSocket channels.

🌐 Production Deployments
Component	URL
Frontend Web App	https://payment-wallet-chat-frontend.vercel.app
Backend API	https://payment-wallet-chat-backend.onrender.com
API Documentation (Swagger)	https://payment-wallet-chat-backend.onrender.com/docs
✅ Deployment Verification
Vercel Deployment
https://Screenshot%25202025-11-22%2520233302.png

Render Deployment
https://Screenshot%25202025-11-22%2520233323.png

Neon Database Setup
https://Screenshot%25202025-11-22%2520233403.png

✨ Core Features
🔐 Authentication & Security
User signup and login

JWT access and refresh tokens

Secure PIN-based validation

Password and PIN verification endpoints

Protected routes using dependency injection

💰 Wallet Operations
Add balance to wallet

Transfer funds to another user

Complete transaction history with pagination

Transaction types and status tracking

💬 Real-time Messaging
Authenticated WebSocket channel

Two-way message streaming

Online/Offline tracking

Message delivery, read, and receipt states

Offline message queue and automatic delivery

Chat history and conversation metadata

🛡️ System Reliability
Graceful WebSocket reconnection

Optimistic UI updates

Server-side message persistence

SQLAlchemy async session management

🛠️ Technology Stack
Frontend
React (Vite) - Modern frontend framework

Zustand - State management

React Query - Data synchronization

Axios - HTTP client

Secure WebSocket - Real-time communication

Backend
FastAPI - High-performance API framework

SQLAlchemy Async ORM - Database operations

Pydantic Schemas - Data validation

PostgreSQL (Neon) - Cloud database

JWT Authentication - Secure auth

WebSocket middleware - Real-time communication

Infrastructure
Vercel - Frontend Hosting

Render - Backend Hosting

Neon - PostgreSQL Cloud DB

⚙️ Environment Configuration
Frontend (.env)
env
VITE_API_URL=https://payment-wallet-chat-backend.onrender.com/api/v1
VITE_WS_URL=wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws
Backend (.env)
env
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
JWT_SECRET_KEY=your-secret-key
JWT_REFRESH_SECRET_KEY=your-refresh-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
📚 API Documentation
Authentication Endpoints
Method	Endpoint	Description
POST	/auth/signup	Create new user
POST	/auth/login	Login and receive tokens
POST	/auth/refresh	Refresh access token
Wallet Endpoints
Method	Endpoint	Description
GET	/wallet/me	Retrieve wallet details
POST	/wallet/add-money	Add funds to wallet
POST	/wallet/transfer	Transfer money to another user
GET	/wallet/history	Query transaction history
Profile Endpoints
Method	Endpoint	Description
GET	/profile/	Get user profile
PUT	/profile/	Update profile details
POST	/profile/verify-pin	Validate PIN
POST	/profile/verify-password	Validate password
Messaging Endpoints (HTTP)
Method	Endpoint	Description
GET	/chat/users	List users available for chat
GET	/chat/history/{identifier}	Conversation history
GET	/chat/conversations	List of user conversations
GET	/chat/all-messages	All messages for user
PUT	/chat/messages/{id}/read	Mark message as read
Messaging WebSocket
WebSocket URL format:

bash
wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws/{user_email}?token=<token>&user_id=<user_id>
Events:

Real-time message receive

Message delivered/read updates

Online/offline user events

Typing indicators

Pending message sync

🚀 Local Development Setup
Frontend
bash
cd frontend
npm install
npm run dev
Backend
bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
📦 Deployment Guide
Frontend (Vercel)
Import GitHub repo to Vercel

Provide environment variables in Vercel dashboard

Build command: npm run build

Output directory: dist

Backend (Render)
Deploy as a Web Service

Start command:

bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4
Add environment variables

Attach PostgreSQL connection

📁 Project Structure
text
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── crud/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   └── services/
└── Dockerfile

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   └── context/
└── vite.config.js
📄 License
This project is licensed under the MIT License.

🔄 Recent Updates
November 22, 2025: Production deployment completed

All services successfully deployed and operational

Real-time messaging fully functional

Wallet transactions processing correctly
