// src/services/ChatService.js
import { chatAPI } from "./api";

const ChatService = {
  // -- DIRECT (PRIVATE) MESSAGES --

  // 1) GET /messages => getContacts
  getContacts: async () => {
    // FIX: changed from "/messages/getCotacts" to "/messages"
    const response = await chatAPI.get("/messages", { withCredentials: true });
    return response.data;
  },

  // 2) GET /messages/getchat/:receiverId => getDirectMessages
  getDirectMessages: async (receiverId, page = 1, limit = 20) => {
    const response = await chatAPI.get(
      `/messages/getchat/${receiverId}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  },

  // 3) POST /messages/upload => uploadFileToDirect
  uploadFileToDirect: async (receiverId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverId", receiverId);

    const response = await chatAPI.post("/messages/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  },

  // -- CHANNEL (GROUP) MESSAGES --

  // 4) GET /channels => getChannels
  getChannels: async () => {
    const response = await chatAPI.get("/channels", { withCredentials: true });
    return response.data;
  },

  // 5) GET /channels/getChat/:channelId => getChannelMessages
  getChannelMessages: async (channelId, page = 1, limit = 10) => {
    const response = await chatAPI.get(
      `/channels/getChat/${channelId}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  },

  // 6) POST /channels/upload => uploadFileToChannel
  uploadFileToChannel: async (channelId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("channelId", channelId);

    const response = await chatAPI.post("/channels/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  },

  // 7) POST /channels/addMember => addChannelMember
  addChannelMember: async (channelId, userId) => {
    const response = await chatAPI.post(
      "/channels/addMember",
      { channelId, userId },
      { withCredentials: true }
    );
    return response.data;
  },

  // 8) POST /channels/removeMember => removeChannelMember
  removeChannelMember: async (channelId, userId) => {
    const response = await chatAPI.post(
      "/channels/removeMember",
      { channelId, userId },
      { withCredentials: true }
    );
    return response.data;
  },
};

export default ChatService;
