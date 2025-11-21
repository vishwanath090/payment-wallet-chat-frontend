import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Check both storage types consistently
  const getToken = () => {
    // Check sessionStorage first, then localStorage
    let token = sessionStorage.getItem("token") || sessionStorage.getItem("access_token");
    if (!token) {
      token = localStorage.getItem("token") || localStorage.getItem("access_token");
    }
    return token;
  };

  const setToken = (token) => {
    // Set in both storage types for consistency
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("access_token", token);
    localStorage.setItem("token", token);
    localStorage.setItem("access_token", token);
  };

  const clearAuthData = () => {
    // Clear from both storage types
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem('user');
    
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem('user');
    
    console.log('🔐 AuthContext - All auth data cleared from both storage types');
  };

  const setUserData = (userData) => {
    // Set in both storage types
    sessionStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const getUserData = () => {
    // Get from both storage types
    let userData = sessionStorage.getItem('user');
    if (!userData) {
      userData = localStorage.getItem('user');
    }
    return userData;
  };

  // Function to refresh user data from backend
  const refreshUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log('🔐 No token found for refresh');
        return null;
      }

      console.log('🔐 Refreshing user data from backend...');
      const userResponse = await fetch('http://127.0.0.1:8000/api/v1/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('🔐 User profile refreshed:', userData);
        
        // Update both storage types and state
        setUserData(userData);
        setUser(userData);
        console.log('✅ User data refreshed successfully');
        return userData;
      } else {
        console.error('🔐 Failed to refresh user profile:', userResponse.status);
        if (userResponse.status === 401) {
          logout();
        }
        throw new Error('Failed to refresh user data');
      }
    } catch (error) {
      console.error('🔐 Error refreshing user:', error);
      throw error;
    }
  };

  // Token refresh function
  const refreshToken = async () => {
    try {
      // Check both storage types for refresh token
      let refreshToken = sessionStorage.getItem("refresh_token");
      if (!refreshToken) {
        refreshToken = localStorage.getItem("refresh_token");
      }
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('🔐 Attempting token refresh...');
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔐 Token refresh successful');
        
        // Update tokens in both storage types
        setToken(data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        
        return data.access_token;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('🔐 Token refresh error:', error);
      logout();
      throw error;
    }
  };

  // Profile update function
  const updateUserProfile = async (profileData) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token');
      
      console.log('🔐 Updating user profile on backend...', profileData);
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile on server');
      }
      
      const updatedProfile = await response.json();
      console.log('🔐 Profile updated on backend:', updatedProfile);
      
      await refreshUser();
      console.log('✅ Profile update completed successfully');
      return updatedProfile;
      
    } catch (error) {
      console.error('🔐 Error updating user profile:', error);
      throw error;
    }
  };

  // Local-only update function
  const updateUser = (updatedUserData) => {
    console.log('🔐 Updating user data locally:', updatedUserData);
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    // Also update both storage types
    const currentUserData = getUserData();
    const currentUser = currentUserData ? JSON.parse(currentUserData) : {};
    const mergedUser = { ...currentUser, ...updatedUserData };
    setUserData(mergedUser);
  };

  useEffect(() => {
    const token = getToken();
    const userData = getUserData();
    
    console.log('🔐 AuthProvider - Initial load');
    console.log('   - Token:', token ? 'Exists' : 'None');
    console.log('   - User data:', userData ? 'Exists' : 'None');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      console.log('✅ AuthProvider - User authenticated');
    } else {
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      console.log('❌ AuthProvider - No valid auth data found');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext - Attempting login with email:', email);
      
      // Clear any existing data before new login
      clearAuthData();
      
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      console.log('🔐 AuthContext - Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔐 AuthContext - Login successful for:', email);
        
        // Use both storage types
        setToken(data.access_token);
        console.log('💾 Token saved to both storage types');
        
        if (data.refresh_token) {
          sessionStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          console.log('💾 Refresh token saved to both storage types');
        }
        
        // Get user profile with the new token
        const userResponse = await fetch('http://127.0.0.1:8000/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('🔐 AuthContext - User profile loaded:', userData);
          
          setUserData(userData);
          console.log('💾 User data saved to both storage types');
          
          setUser(userData);
        } else {
          console.error('🔐 AuthContext - Failed to load user profile:', userResponse.status);
          // Fallback user data
          const fallbackUser = { 
            email: email, 
            id: Date.now().toString(),
            full_name: email.split('@')[0]
          };
          setUserData(fallbackUser);
          setUser(fallbackUser);
        }
        
        setIsAuthenticated(true);
        console.log('✅ AuthContext - Login completed successfully for:', email);
        return { success: true };
      } else {
        const errorData = await response.json();
        console.log('🔐 AuthContext - Login failed:', errorData);
        throw new Error(errorData.detail || 'Invalid email or password');
      }
    } catch (error) {
      console.error('🔐 AuthContext - Login error:', error);
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log('🔐 AuthContext - Logout called, clearing all data');
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    refreshUser,
    updateUser,
    updateUserProfile,
    refreshToken,
    getToken // Export for components that need it
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};