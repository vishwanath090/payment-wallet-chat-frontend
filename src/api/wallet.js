// api/wallet.js - FIXED with proper PIN error handling
import api, { getUserFriendlyErrorMessage } from './client';

export const getMyWallet = async () => {
  try {
    console.log('💰 Wallet API - Fetching wallet data');
    const response = await api.get('/wallet/me');
    console.log('💰 Wallet API - Wallet data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('💰 Wallet API - Error fetching wallet:');
    console.error('   - Status:', error.response?.status);
    console.error('   - Data:', error.response?.data);
    
    const userMessage = getUserFriendlyErrorMessage(error);
    
    // ✅ Create enhanced error that preserves PIN error info
    const enhancedError = new Error(userMessage);
    enhancedError.isPinError = error.isPinError || error.isWalletError;
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
};

export const addMoney = async (data) => {
  try {
    console.log('💰 Wallet API - Adding money:', { 
      amount: data.amount, 
      pin_length: data.pin ? data.pin.length : 'missing' 
    });
    const response = await api.post('/wallet/add-money', data);
    console.log('💰 Wallet API - Add money successful');
    return response.data;
  } catch (error) {
    console.error('💰 Wallet API - Add money error:');
    console.error('   - Status:', error.response?.status);
    console.error('   - Data:', error.response?.data);
    
    const userMessage = getUserFriendlyErrorMessage(error);
    
    // ✅ Create enhanced error that preserves PIN error info
    const enhancedError = new Error(userMessage);
    enhancedError.isPinError = error.isPinError || error.isWalletError;
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
};

export const transfer = async (data) => {
  try {
    console.log('💰 Wallet API - Transferring money:', { 
      to_email: data.to_email, 
      amount: data.amount,
      pin_length: data.pin ? data.pin.length : 'missing'
    });
    
    const response = await api.post('/wallet/transfer', data);
    console.log('💰 Wallet API - Transfer successful');
    return response.data;
  } catch (error) {
    console.error('💰 Wallet API - Transfer error:');
    console.error('   - Status:', error.response?.status);
    console.error('   - Data:', error.response?.data);
    
    const userMessage = getUserFriendlyErrorMessage(error);
    
    // ✅ Create enhanced error that preserves PIN error info
    const enhancedError = new Error(userMessage);
    enhancedError.isPinError = error.isPinError || error.isWalletError;
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
};

export const getHistory = async (params = {}) => {
  try {
    console.log('💰 Wallet API - Fetching transaction history:', params);
    const response = await api.get('/wallet/history', { params });
    console.log('💰 Wallet API - History received');
    return response.data;
  } catch (error) {
    console.error('💰 Wallet API - History fetch error:');
    console.error('   - Status:', error.response?.status);
    console.error('   - Data:', error.response?.data);
    
    const userMessage = getUserFriendlyErrorMessage(error);
    
    // ✅ Create enhanced error that preserves PIN error info
    const enhancedError = new Error(userMessage);
    enhancedError.isPinError = error.isPinError || error.isWalletError;
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
};

// ✅ Helper function to check if error is a PIN error (for components)
export const isPinError = (error) => {
  return error?.isPinError === true;
};

// ✅ Helper function to check if error is a wallet error (for components)
export const isWalletError = (error) => {
  return error?.isWalletError === true;
};

// ✅ Helper function to check if error should NOT trigger logout
export const shouldNotLogout = (error) => {
  return error?.isPinError === true || error?.isWalletError === true;
};