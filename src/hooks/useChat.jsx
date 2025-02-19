import { useState, useEffect, useCallback } from 'react';
import ChatService from '../services/chatService';

export const useChat = (chatType) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (chatType === "direct") {
        response = await ChatService.getContacts();
        if (response.success && Array.isArray(response.data)) {
          console.log("Contacts received:", response.data); // Crucial log
          setChats(response.data);
        } else {
          setChats([]);
        }
      } else {
        response = await ChatService.getChannels();
        if (response.success && response.msg && Array.isArray(response.msg.channels)) {
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

  const fetchMessages = useCallback(async (chat) => {
    if (!chat || !chat._id) {
      console.error("fetchMessages: Chat object or ID is missing", chat);
      return;
    }

    setLoading(true);
    try {
      let data;
      if (chatType === "direct") {
        const receiverId = Number(chat._id); // Convert to number
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

      setMessages((prevMessages) => {
        const messageIds = new Set(prevMessages.map((msg) => msg._id));
        const uniqueNewMessages = data.msg.messages.filter((msg) => !messageIds.has(msg._id));
        return [...prevMessages, ...uniqueNewMessages];
      });

    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err?.message || "Error fetching messages");
    } finally {
      setLoading(false);
    }
  }, [chatType]);

  const handleChatSelect = (chat) => {
    if (!chat || !chat._id) {
      console.error("handleChatSelect: Chat is invalid", chat);
      return;
    }

    if (chat._id === currentChat?._id) return;

    if (!chats.find(c => c._id === chat._id)) {
      console.warn("Selected chat not yet available. Waiting...");
      setCurrentChat(chat); // Optimistic update
      setMessages([]);
      fetchMessages(chat);
      return; // Important: Exit to prevent errors
    }

    setCurrentChat(chat);
    setMessages([]);
    fetchMessages(chat);
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    console.log("Chats state updated:", chats); // Crucial log
  }, [chats]);


  return {
    chats,
    currentChat,
    setCurrentChat: handleChatSelect,
    messages,
    setMessages,
    loading,
    error,
    fetchMessages,
    uploadFile: useCallback(async (file) => { // Added useCallback
      if (!currentChat) return;
      try {
        if (chatType === "direct") {
          await ChatService.uploadFileToDirect(currentChat._id, file);
        } else {
          await ChatService.uploadFileToChannel(currentChat._id, file);
        }
      } catch (err) {
        setError(err?.message || "File upload failed");
      }
    }, [currentChat, chatType]),
  };
};