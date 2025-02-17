import api from './api';

const ChatService = {
  getContacts: async () => {
    const response = await api.get('/messages/');
    return response.data;
  },

  getDirectMessages: async (receiverId, page = 1, limit = 20) => {
    const response = await api.get(`/${receiverId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  sendDirectMessage: async (receiverId, content) => {
    const response = await api.post(`/${receiverId}`, { content });
    return response.data;
  },

  uploadFile: async (receiverId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/messages/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getChannels: async () => {
    const response = await api.get('/channels');
    return response.data;
  },

  getChannelMessages: async (channelName, page = 1, limit = 10) => {
    const response = await api.get(`/channels/getchat/${channelName}?page=${page}&limit=${limit}`);
    return response.data;
  },

  sendChannelMessage: async (channelName, content) => {
    const response = await api.post(`/channels/${channelName}`, { content });
    return response.data;
  },

  addChannelMember: async (channelId, userId) => {
    const response = await api.post('/channels/addMember', { channelId, userId });
    return response.data;
  },

  removeChannelMember: async (channelId, userId) => {
    const response = await api.post('/channels/removeMember', { channelId, userId });
    return response.data;
  },
};

export default ChatService;