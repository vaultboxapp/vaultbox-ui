import axios from 'axios';

const API = axios.create({
  baseURL: '/', // Now API calls are sent to /api/...
});

const ChatService = {
  getChannels: async () => {
    const response = await API.get('/channels');
    return response.data;
  },
  getContacts: async () => {
    const response = await API.get('/messages'); // assuming /contacts for direct chats
    return response.data;
  },
  getDirectMessages: async (chatId) => {
    const response = await API.get(`/messages/getchat/${chatId}?page=1&limit=20`);
    return response.data;
  },
  getChannelMessages: async (chnlId) => {
    const response = await API.get(`/channels/getChat/${chnlId}?page=1&limit=20`);
    return response.data;
  },
  uploadFileToDirect: async (chatId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post(`/upload/direct/${chatId}`, formData);
    return response.data;
  },
  uploadFileToChannel: async (chnl, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post(`/upload/channel/${chnl}`, formData);
    return response.data;
  },
};

export default ChatService;
