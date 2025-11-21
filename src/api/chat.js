// src/api/chat.js 
import api from "./client";

// Get available users for chat
export const getChatUsers = async () => {
  try {
    const response = await api.get('/chat/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat users:', error);
    throw error;
  }
};

// Get chat history with a user
export const getChatHistory = async (receiverIdentifier) => {
  try {
    const response = await api.get(`/chat/history/${encodeURIComponent(receiverIdentifier)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    // Return empty array instead of throwing error for better UX
    return [];
  }
};

// Test send message
export const testSendMessage = async (receiverIdentifier, content) => {
  try {
    const response = await api.post('/chat/test-send-message', null, {
      params: {
        receiver_identifier: receiverIdentifier,
        content: content
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending test message:', error);
    throw error;
  }
};

// Get conversations list
export const getConversations = async () => {
  try {
    const response = await api.get('/chat/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

// Get received messages
export const getReceivedMessages = async () => {
  try {
    const response = await api.get('/chat/received-messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching received messages:', error);
    return [];
  }
};

// Get all messages
export const getAllMessages = async () => {
  try {
    const response = await api.get('/chat/all-messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching all messages:', error);
    return [];
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await api.put(`/chat/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};