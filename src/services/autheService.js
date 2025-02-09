// frontend -> services/autheService.js
import api from "./api";

// Call login API and store temporary user ID for OTP verification.
export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    // Store the userId temporarily; it will be upgraded after OTP verification.
    localStorage.setItem("tempUserId", response.data.userId);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Login failed");
  }
};

// Call verifyOTP API; after success, move tempUserId to permanent userId.
export const verifyOTP = async (otp) => {
  try {
    // Retrieve the temporary user ID from local storage.
    const userId = localStorage.getItem("tempUserId");
    if (!userId) {
      throw new Error("User ID missing from temporary storage");
    }
    // Pass both the userId and otp to the backend.
    const response = await api.post("/api/auth/verify-otp", { userId, otp });
    // Even if the backend response doesn’t include the userId,
    // store it permanently and remove the temporary key.
    localStorage.setItem("userId", userId);
    localStorage.removeItem("tempUserId");
    return { ...response.data, userId };
  } catch (error) {
    throw error.response?.data || new Error("OTP verification failed");
  }
};

// Retrieves user details from the backend using the permanent userId.
export const getUserById = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found");
    const response = await api.get(`/api/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    localStorage.removeItem("userId"); // Cleanup on error.
    throw error.response?.data || new Error("Failed to fetch user data");
  }
};

// Call the logout API and clear all locally stored user data.
export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Error during logout");
  }
};
