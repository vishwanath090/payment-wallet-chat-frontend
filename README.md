WalletPay Platform

Digital Wallet System with Realtime Messaging

Overview

WalletPay is a full-stack digital wallet and communication platform designed with modern engineering principles.
It provides secure user authentication, wallet management, financial transactions, and realtime WebSocket-based chat.
The platform serves as a production-ready architecture example combining FastAPI, PostgreSQL, React, and Vercel/Render deployments.

Architecture
Frontend (React + Vite) → Vercel
Backend API (FastAPI + JWT Auth) → Render
Realtime Chat (WebSocket) → FastAPI WS Router
Database (PostgreSQL) → Neon Cloud


All services communicate through secure API routes and authenticated WebSocket channels.

Production Deployments
Component	URL
Frontend Web App	https://payment-wallet-chat-frontend.vercel.app

Backend API	https://payment-wallet-chat-backend.onrender.com

API Documentation (Swagger)	https://payment-wallet-chat-backend.onrender.com/docs
Deployment Verification
Vercel Deployment

Render Deployment

Neon Database Setup

Core Features
Authentication & Security

User signup and login

JWT access and refresh tokens

Secure PIN-based validation

Password and PIN verification endpoints

Protected routes using dependency injection

Wallet Operations

Add balance to wallet

Transfer funds to another user

Complete transaction history with pagination

Transaction types and status tracking

Realtime Messaging

Authenticated WebSocket channel

Two-way message streaming

Online/Offline tracking

Message delivery, read, and receipt states

Offline message queue and automatic delivery

Chat history and conversation metadata

System Reliability

Graceful WebSocket reconnection

Optimistic UI updates

Server-side message persistence

SQLAlchemy async session management

Technology Stack
Frontend

React (Vite)

Zustand state management

React Query (data synchronization)

Axios HTTP client

Secure WebSocket integration

Backend

FastAPI

SQLAlchemy Async ORM

Pydantic Schemas

PostgreSQL (Neon)

JWT Authentication

WebSocket authentication middleware

Infrastructure

Vercel (Frontend Hosting)

Render (Backend Hosting)

Neon (PostgreSQL Cloud DB)

Environment Configuration
Frontend (.env)
VITE_API_URL=https://payment-wallet-chat-backend.onrender.com/api/v1
VITE_WS_URL=wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws

Backend (.env)
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>/<database>
JWT_SECRET_KEY=<your-secret>
JWT_REFRESH_SECRET_KEY=<your-refresh-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=30

API Documentation (Summary)
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

wss://payment-wallet-chat-backend.onrender.com/api/v1/chat/ws/{user_email}?token=<JWT>&user_id=<UUID>


Events:

Realtime message receive

Message delivered/read updates

Online/offline user events

Typing indicators

Pending message sync

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
Frontend (Vercel)

Import GitHub repo

Provide .env variables in Vercel dashboard

Build: npm run build

Output: dist

Backend (Render)

Deploy as a Web Service

Start command:

gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4


Add environment variables

Attach PostgreSQL connection

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
