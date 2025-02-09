// frontend -> context/auth.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getUserById as fetchUserById } from "@/services/autheService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage so the data persists between sessions.
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("user");
  });

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  };

  // A helper function for successful login (e.g. after OTP verification)
  const handleLoginSuccess = (userData) => {
    login(userData);
  };

  // On app load, if there is a stored user, use it.
  // If only a userId exists, fetch the full user details from the backend.
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else if (localStorage.getItem("userId")) {
      fetchUserById()
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
