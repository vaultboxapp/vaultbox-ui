// frontend -> context/auth.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getUserById as fetchUserById } from "@/services/autheService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Safely load full user data from localStorage.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));

  // Save full user data in localStorage after successful login.
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("tempUserId");
  };

  // A helper function for successful login (e.g. after OTP verification)
  const handleLoginSuccess = (userData) => {
    login(userData);
  };

  // On app load, if there is a temp userId stored but no full user in localStorage, trigger fetching full user details.
  useEffect(() => {
    if (!localStorage.getItem("user") && localStorage.getItem("tempUserId")) {
      const tempUserId = localStorage.getItem("tempUserId");
      fetchUserById(tempUserId)
        .then((response) => {
          if (response && response.user) {
            login(response.user);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data on init", error);
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, handleLoginSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
