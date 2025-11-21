import api from "./client";

export async function getAllUsers() {
  console.log('Users API - Fetching all users');
  const response = await api.get("/users");
  return response.data;
}

export async function getUserById(userId) {
  console.log('Users API - Fetching user by ID:', userId);
  const response = await api.get(`/users/${userId}`);
  return response.data;
}