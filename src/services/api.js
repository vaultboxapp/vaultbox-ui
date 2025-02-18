// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: true,
});

export const chatAPI = axios.create({
  baseURL: "https://vaultbox",
  withCredentials: true,
});

chatAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
