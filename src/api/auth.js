// src/api/auth.js
import api from "./client";

export const login = async (credentials) => {
  console.log('Auth API - Login attempt:', credentials.email);
  const response = await api.post("/auth/login", credentials);
  console.log('Auth API - Login response received');
  return response.data;
};

export const signup = async (data) => {
  console.log('Auth API - Signup attempt:', data.email);
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const verifyPin = async (pin) => {
  console.log('Auth API - PIN verification attempt');
  const response = await api.post("/auth/verify-pin", { pin });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  console.log('Auth API - Token refresh attempt');
  const response = await api.post("/auth/refresh", { refresh_token: refreshToken });
  return response.data;
};