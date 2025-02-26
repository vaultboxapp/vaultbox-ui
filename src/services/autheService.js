import { api, chatAPI } from "./api"; // Use `api` if your backend is on localhost:5000

export const login = async (email, password) => {
  try {
    const response = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    localStorage.setItem("tempUserId", response.data.userId);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Login failed");
  }
};

export const signUp = async (username, email, password) => {
  try {
    const response = await api.post(
      "/auth/register",
      { username, email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Sign up failed");
  }
};

export const verifyOTP = async (otp) => {
  try {
    const userId = localStorage.getItem("tempUserId");
    if (!userId) throw new Error("User ID missing from temporary storage");
    const response = await api.post(
      "/auth/verify-otp",
      { userId, otp },
      { withCredentials: true }
    );
    localStorage.setItem("userId", userId);
    localStorage.removeItem("tempUserId");
    return { ...response.data, userId };
  } catch (error) {
    throw error.response?.data || new Error("OTP verification failed");
  }
};

export const getUserById = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");
    const response = await api.get(
      `/auth/user/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    localStorage.removeItem("userId");
    throw error.response?.data || new Error("Failed to fetch user data");
  }
};

export const logout = async () => {
  try {
    const response = await api.post(
      "/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Error during logout");
  }
};