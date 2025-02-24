import { useState, useEffect, useCallback } from 'react';
import ChatService from '../../../services/chatService';

export const useChat = (chatType) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (chatType === "direct") {
        response = await ChatService.getContacts();
        if (response.success && Array.isArray(response.data)) {
          console.log("Contacts received:", response.data);
          setChats(response.data);
        } else {
          setChats([]);
        }
      } else {
        response = await ChatService.getChannels();
        if (response.success && response.msg && Array.isArray(response.msg.channels)) {
          console.log("Channels received:", response.msg.channels);
          setChats(response.msg.channels);
        } else {
          setChats([]);
        }
      }
    } catch (err) {
      setError(err?.message || "Error fetching chats");
    } finally {
      setLoading(false);
    }
  }, [chatType]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await ChatService.getAllUsers();
      console.log("Raw response from getAllUsers:", response);
      if (response.success && Array.isArray(response.msg)) {
        console.log("Users received:", response.msg);
        setUsers(response.msg);
      } else if (response.success && Array.isArray(response.data)) {
        console.log("Users received:", response.data);
        setUsers(response.data);
      } else {
        console.warn("No valid users data:", response);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err?.message || "Error fetching users");
    }
  }, []);
  

  const fetchMessages = useCallback(async (chat) => {
    if (!chat || !chat._id) {
      console.error("fetchMessages: Chat object or ID is missing", chat);
      return;
    }
  
    setLoading(true);
    try {
      let data;
      if (chatType === "direct") {
        const receiverId = Number(chat._id);
        if (isNaN(receiverId)) {
          console.error("Invalid receiverId (NaN):", chat._id);
          setError("Invalid chat ID");
          return;
        }
        console.log("Fetching direct messages for receiverId:", receiverId);
        data = await ChatService.getDirectMessages(receiverId);
        if (!data || !data.success || !data.msg || !Array.isArray(data.msg.messages)) {
          console.error("Invalid data received:", data);
          setMessages([]);
          return;
        }
      } else {
        data = await ChatService.getChannelMessages(chat._id);
      }
  
      setMessages((prev) => {
        const messageIds = new Set(prev.map((msg) => msg._id));
        const enrichedMessages = data.msg.messages.map((msg) => {
          const sender = users.find((u) => Number(u._id) === Number(msg.senderId));
          return {
            ...msg,
            senderName: sender?.username || "Unknown",
          };
        });
        const uniqueNewMessages = enrichedMessages.filter((msg) => !messageIds.has(msg._id));
        // Sort messages so the oldest come first
        uniqueNewMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return [...prev, ...uniqueNewMessages];
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err?.message || "Error fetching messages");
    } finally {
      setLoading(false);
    }
  }, [chatType, users]);
  

  const handleChatSelect = (chat) => {
    if (!chat || !chat._id) {
      console.error("handleChatSelect: Chat is invalid", chat);
      return;
    }
    if (chat._id === currentChat?._id) return;
    if (!chats.find((c) => c._id === chat._id)) {
      console.warn("Selected chat not yet available. Waiting...");
      setCurrentChat(chat);
      setMessages([]);
      fetchMessages(chat);
      return;
    }
    setCurrentChat(chat);
    setMessages([]);
    fetchMessages(chat);
  };

  useEffect(() => {
    fetchChats();
    fetchUsers(); // Fetch users on mount
  }, [fetchChats, fetchUsers]);

  useEffect(() => {
    console.log("Chats state updated:", chats);
    console.log("Users state updated:", users);
  }, [chats, users]);

  return {
    chats,
    currentChat,
    setCurrentChat: handleChatSelect,
    messages,
    setMessages,
    users,
    loading,
    error,
    fetchMessages,
    uploadFile: useCallback(async (file) => {
      if (!currentChat) return;
      try {
        if (chatType === "direct") {
          await ChatService.uploadFileToDirect(currentChat._id, file);
        } else {
          await ChatService.uploadFileToChannel(currentChat._id, file);
        }
      } catch (err) {
        setError(err?.message || "Error uploading file");
      }
    }, [currentChat, chatType]),
  };
};