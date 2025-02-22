"use client"

import { createContext, useContext, useState, useCallback } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
        return null
      }
    }
    return null
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"))

  const login = useCallback((userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("tempUserId")
  }, [])

  const handleLoginSuccess = (userData) => {
    login(userData)
  }

  // Removed the useEffect that calls getUserById with tempUserId.
  // Now, once OTP verification is complete, verifyOTP returns the full user data,
  // and handleLoginSuccess is called to update state.

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, handleLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
