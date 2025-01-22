// This file will contain all the API calls to the backend
// For now, it's just a placeholder


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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
    getUsers: () => {
      // Return a promise that resolves with the list of users
      return Promise.resolve([])
    },
    
    // Message related API calls
    getInitialMessages: () => {
      // Return a promise that resolves with the initial list of messages
      return Promise.resolve([])
    },
    
    getMessagesForUser: (userId) => {
      // Return a promise that resolves with the messages for a specific user
      return Promise.resolve([])
    },
    
    sendMessage: (message) => {
      // Return a promise that resolves when the message is sent
      return Promise.resolve()
    },
    
    // File related API calls
    uploadFile: (file) => {
      // Return a promise that resolves with the uploaded file information
      return Promise.resolve({})
    },
    
    // Channel related API calls
    getChannels: () => {
      // Return a promise that resolves with the list of channels
      return Promise.resolve([])
    },
    
    getInitialChannelMessages: () => {
      // Return a promise that resolves with the initial list of channel messages
      return Promise.resolve([])
    },
    
    getMessagesForChannel: (channelId) => {
      // Return a promise that resolves with the messages for a specific channel
      return Promise.resolve([])
    },
    
    sendChannelMessage: (channelId, message) => {
      // Return a promise that resolves when the channel message is sent
      return Promise.resolve()
    },
    
    uploadChannelFile: (channelId, file) => {
      // Return a promise that resolves with the uploaded channel file information
      return Promise.resolve({})
    },
  }