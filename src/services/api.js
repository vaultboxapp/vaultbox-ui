import axios from 'axios';
import { getToken } from '../utils/jwtUtils';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend URL
});

// Add a request interceptor to include the JWT token in the headers
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  // User related API calls
  getUsers: () => axiosInstance.get('/users'),

  // Message related API calls
  getInitialMessages: () => axiosInstance.get('/messages'),
  getMessagesForUser: (userId) => axiosInstance.get(`/messages/getchat/${userId}`),
  sendMessage: (message) => axiosInstance.post('/messages', message),

  // File related API calls
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Channel related API calls
  getChannels: () => axiosInstance.get('/channels'),
  getInitialChannelMessages: (channelId) => axiosInstance.get(`/channels/getchat/${channelId}`),
  sendChannelMessage: (channelId, message) => axiosInstance.post(`/channels/${channelId}/messages`, message),
  uploadChannelFile: (channelId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post(`/channels/${channelId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};