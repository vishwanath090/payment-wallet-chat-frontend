// api/profile.js - UPDATED with helper functions
import api from './client';

// Get user profile
export const getProfile = async () => {
  try {
    console.log('Profile API - Fetching profile');
    const response = await api.get('/profile/');
    console.log('Profile API - Profile data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile API - Error fetching profile:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    console.log('Profile API - Updating profile with data:', profileData);
    const response = await api.put('/profile/', profileData);
    console.log('Profile API - Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile API - Error updating profile:', error);
    throw error;
  }
};

// Verify PIN
// api/profile.js - FIXED verifyPin with proper error enhancement
export const verifyPin = async (pinData) => {
  try {
    console.log('Profile API - Verifying PIN with data:', pinData);
    const response = await api.post('/profile/verify-pin', pinData);
    console.log('Profile API - PIN verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile API - Error verifying PIN:', error);
    
    // ✅ ENHANCE: Handle 422 errors as PIN errors
    let errorMessage = 'PIN verification failed';
    
    if (error.response?.status === 422) {
      // This is likely a PIN validation error
      errorMessage = 'Invalid PIN';
    } else if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    }
    
    // Create enhanced error with PIN error flag
    const enhancedError = new Error(errorMessage);
    enhancedError.isPinError = true; // ✅ Mark as PIN error
    enhancedError.status = error.response?.status;
    enhancedError.response = error.response;
    
    throw enhancedError;
  }
};

// Verify Password
export const verifyPassword = async (password) => {
  try {
    console.log('Profile API - Verifying password');
    const response = await api.post('/profile/verify-password', { password });
    console.log('Profile API - Password verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile API - Error verifying password:', error);
    throw error;
  }
};

// Change Password
export const changePassword = async (passwordData) => {
  try {
    console.log('Profile API - Changing password');
    const response = await api.put('/profile/change-password', passwordData);
    console.log('Profile API - Password change response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile API - Error changing password:', error);
    throw error;
  }
};

// ADD THIS MISSING EXPORT - handlePasswordChange
export const handlePasswordChange = async (currentPassword, newPassword) => {
  try {
    console.log('Profile API - Handling password change');
    
    // First verify current password
    await verifyPassword(currentPassword);
    
    // Then change to new password
    const result = await changePassword({
      current_password: currentPassword,
      new_password: newPassword
    });
    
    console.log('Profile API - Password change completed successfully');
    return result;
  } catch (error) {
    console.error('Profile API - Error in handlePasswordChange:', error);
    throw error;
  }
};

// ✅ ADD THESE HELPER FUNCTIONS for PIN error handling
export const isPinError = (error) => {
  return error?.isPinError === true;
};

export const isWalletError = (error) => {
  return error?.isWalletError === true;
};

export const shouldNotLogout = (error) => {
  return error?.isPinError === true || error?.isWalletError === true;
};