// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Your backend server URL
  withCredentials: true, // Include cookies if needed
});

export default api;
