// src/hooks/useChat.js
import { useState, useEffect, useCallback } from 'react';
import ChatService from '../services/chatService';

export const useChat = (chatType) => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all channels or direct contacts
  const fetchChats = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        chatType === 'direct'
          ? await ChatService.getContacts()
          : await ChatService.getChannels();
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatType]);

  // Fetch messages for a particular channel or direct chat
  const fetchMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;
      setLoading(true);
      try {
        const data =
          chatType === 'direct'
            ? await ChatService.getDirectMessages(chatId)
            : await ChatService.getChannelMessages(chatId);
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [chatType]
  );

  // Removed the old "sendMessage" that used HTTP
  // We'll rely solely on WebSockets for sending text messages.

  // Keep file upload (HTTP) for direct or channel
  const uploadFile = useCallback(
    async (file) => {
      if (!currentChat) return;
      try {
        if (chatType === 'direct') {
          await ChatService.uploadFileToDirect(currentChat.id, file);
        } else {
          await ChatService.uploadFileToChannel(currentChat.id, file);
        }
        // Optionally re-fetch messages or push to local state
      } catch (err) {
        setError(err.message);
      }
    },
    [currentChat, chatType]
  );

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    loading,
    error,
    fetchMessages,
    uploadFile, // no direct "sendMessage" here
  };
};
