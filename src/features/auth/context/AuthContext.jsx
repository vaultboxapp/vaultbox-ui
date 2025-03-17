"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Initialize from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (error) {
        localStorage.removeItem("user")
        return null
      }
    }
    return null
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user"))
  const [refreshTokenValue, setRefreshTokenValue] = useState(() => localStorage.getItem("refreshToken") || null)

  // Add effect to handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const refreshToken = params.get('refreshToken')
      const oauthSuccess = params.get('oauth') === 'success'
      
      if (refreshToken && oauthSuccess) {
        try {
          // Get user info from cookie
          const userInfoCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('userInfo='))
          
          if (userInfoCookie) {
            const userInfo = JSON.parse(decodeURIComponent(userInfoCookie.split('=')[1]))
            
            // Make sure we have a name field for consistency
            if (!userInfo.name && userInfo.username) {
              userInfo.name = userInfo.username;
            }
            
            // Update auth state
            setUserData(userInfo, refreshToken)
            
            // Clean up URL
            window.history.replaceState({}, document.title, '/dashboard')
            
            // Force a page reload to ensure everything is properly initialized
            window.location.reload()
          }
        } catch (error) {
          console.error('Error handling OAuth callback:', error)
          // Redirect to login on error
          window.location.href = '/login'
        }
      }
    }

    handleOAuthCallback()
  }, []) // Run once on mount

  // Add this effect to handle page refreshes and maintain authentication state
  useEffect(() => {
    const checkAuthStatus = () => {
      // Set loading while we check auth status
      setLoading(true);
      
      try {
        // Check if we have a user in localStorage
        const storedUser = localStorage.getItem("user");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        
        if (storedUser && storedRefreshToken) {
          try {
            // Parse the stored user
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            setRefreshTokenValue(storedRefreshToken);
          } catch (e) {
            // Invalid JSON in localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        } else {
          // No stored credentials
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // On error, assume not authenticated but don't redirect
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []); // Run once on mount

  // Helper: update user state and persist in localStorage.
  const setUserData = useCallback((userData, refreshToken) => {
    // Ensure we have all required user fields
    const normalizedUserData = {
      id: userData.id,
      username: userData.username || userData.name || 'User',
      name: userData.name || userData.username || 'User', // Fallback to username if name is not provided
      email: userData.email || '',
      isEmailVerified: userData.isEmailVerified || false,
      mfaEnabled: userData.mfaEnabled || false,
      role: userData.role || 'user',
      avatar: userData.avatar || null,
      avatarUrl: userData.avatarUrl || null,
    };
    
    setUser(normalizedUserData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(normalizedUserData));
    if (refreshToken) {
      setRefreshTokenValue(refreshToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, []);

  // Standard login – expects user JSON and refreshToken in the response.
  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 403 && data.message === "New device detected") {
          return {
            success: false,
            requiresDeviceVerification: true,
            userId: data.userId,
            deviceId: data.deviceId,
          }
        }
        throw new Error(data.message || "Login failed")
      }
      if (data.user) {
        setUserData(data.user, data.refreshToken)
      } else {
        throw new Error("User data missing in response")
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [setUserData])

  // Simplified OAuth login – triggers a full-page redirect.
  // Your backend should handle the OAuth flow, set the tokens as HTTP-only cookies,
  // and then redirect back to your front end.
  const oauthLogin = useCallback(() => {
    window.location.href = "http://localhost:5000/api/auth/google" 

  }, [])

  const logout = useCallback(async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        const data = await response.json();
        console.error("Logout failed:", data.message);
        // Continue with logout anyway
      }
      
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setRefreshTokenValue(null);
      
      // Redirect to login page
      window.location.href = "/login";
      
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, we should still clear local state and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      setRefreshTokenValue(null);
      window.location.href = "/login";
      
      return { success: false, error: error.message };
    }
  }, []);

  // Other functions (register, verifyEmail, verifyDevice, forgotPassword, resetPassword, enableMfa, verifyMfa) remain unchanged.
  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (token) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Email verification failed")
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const verifyDevice = async (verificationData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData),
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Device verification failed")
      }
      setUserData(data.user, data.refreshToken)
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Password reset request failed")
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (resetData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed")
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const enableMfa = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/enable-mfa", {
        method: "POST",
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "MFA setup failed")
      }
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const verifyMfa = async (code) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "MFA verification failed")
      }
      // Update the user state to indicate MFA is enabled
      setUser(prev => {
        const updated = { ...prev, mfaEnabled: true }
        localStorage.setItem("user", JSON.stringify(updated))
        return updated
      })
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      if (!refreshTokenValue) return
      const response = await fetch("http://localhost:5000/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
        credentials: "include",
      })
      const data = await response.json()
      if (response.ok) {
        // Optionally update user data if necessary.
      }
    } catch (err) {
      console.error("Error refreshing token:", err)
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    verifyEmail,
    login,
    oauthLogin, // This now triggers a redirect.
    verifyDevice,
    forgotPassword,
    resetPassword,
    enableMfa,
    verifyMfa,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
