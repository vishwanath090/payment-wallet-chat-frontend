WalletPay Platform

Digital Wallet System with Realtime Messaging

Overview

WalletPay is a full-stack digital wallet and realtime communication system built using FastAPI, PostgreSQL, React, and WebSockets.
It implements secure authentication, wallet transactions, realtime chat, and cloud-ready deployments using Vercel, Render, and Neon.

This project follows modern backend and frontend engineering standards and demonstrates scalable production architecture.

System Architecture
Frontend (React + Vite) → Vercel
Backend API (FastAPI + JWT Auth) → Render
Realtime Chat (WebSocket) → FastAPI WS Router
Database (PostgreSQL) → Neon Cloud

Production Deployments
Component	URL
Frontend Web Application	https://payment-wallet-chat-frontend.vercel.app

Backend REST API	https://payment-wallet-chat-backend.onrender.com

API Documentation (Swagger UI)	https://payment-wallet-chat-backend.onrender.com/docs
Deployment Verification

Use your own image paths inside the repository. Example:

![](docs/screens/vercel.png)
![](docs/screens/render.png)
![](docs/screens/neon.png)

Core Features
Authentication & Security

Email-based signup and login

JWT access and refresh tokens

Secure PIN-based operations

Password & PIN verification APIs

Fully protected routes with dependency injection

Wallet Operations

Add money to wallet

Transfer money between users

Paginated transaction history

Transaction types and status tracking

Server-side validation and error handling

Realtime Messaging

Authenticated WebSocket channel

Two-way messaging flow

Online/offline user tracking

Delivery and read receipts

Chat history retrieval

Pending message delivery after reconnection

Reliability & Stability

Automatic WebSocket reconnection

Optimistic UI updates

Server-validated persistence

Async database operations

Technology Stack
Frontend

React (Vite)

React Query

Zustand

Axios

WebSockets

Backend

FastAPI

SQLAlchemy Async ORM

JWT authentication

Pydantic validation

WebSocket router

Infrastructure

Vercel (Frontend hosting)

Render (Backend hosting)

Neon (Managed PostgreSQL)

Environment Configuration
Frontend .env
VITE_API_URL=https://payment-wallet-chat-backend.onrender.com/api/v1
VITE_WS_URL=wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws

Backend .env
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<database>
JWT_SECRET_KEY=<secret>
JWT_REFRESH_SECRET_KEY=<refresh-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=30

API Documentation Summary
Authentication
Method	Endpoint	Description
POST	/auth/signup	Register a new user
POST	/auth/login	Authenticate and obtain tokens
POST	/auth/refresh	Refresh access token
Wallet
Method	Endpoint	Description
GET	/wallet/me	Get wallet details
POST	/wallet/add-money	Add funds
POST	/wallet/transfer	Transfer to another user
GET	/wallet/history	Transaction history
Profile
Method	Endpoint	Description
GET	/profile/	Retrieve profile
PUT	/profile/	Update profile
POST	/profile/verify-pin	Verify transaction PIN
POST	/profile/verify-password	Verify password
Messaging (HTTP)
Method	Endpoint	Description
GET	/chat/users	List all chat-eligible users
GET	/chat/history/{identifier}	Retrieve two-way chat history
GET	/chat/all-messages	Fetch all messages
PUT	/chat/messages/{id}/read	Mark a message as read
WebSocket Messaging
WebSocket URL Format
wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws/{user_email}?token=<JWT>&user_id=<UUID>

WebSocket Capabilities

Message sending and receiving

Delivery confirmations

Read receipts

Presence tracking

Automatic pending message delivery

Local Development Setup
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Deployment Guide
Frontend Deployment (Vercel)

Import GitHub repository

Add environment variables

Build command:

npm run build


Output directory:

dist

Backend Deployment (Render)

Deploy as Web Service

Start command:

gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4


Add environment variables

Link PostgreSQL database

Project Structure
backend/
  app/
    api/
    core/
    crud/
    db/
    models/
    schemas/
    services/
  Dockerfile

frontend/
  src/
    api/
    components/
    pages/
    context/
  vite.config.js

License

This project is licensed under the MIT License.
