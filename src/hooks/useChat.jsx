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
      const data = chatType === 'direct' 
        ? await ChatService.getContacts()
        : await ChatService.getChannels();
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatType]);

  const fetchMessages = useCallback(async (chatId) => {
    setLoading(true);
    try {
      const data = chatType === 'direct'
        ? await ChatService.getDirectMessages(chatId)
        : await ChatService.getChannelMessages(chatId);
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chatType]);

  const sendMessage = useCallback(async (content) => {
    if (!currentChat) return;
    try {
      const data = chatType === 'direct'
        ? await ChatService.sendDirectMessage(currentChat.id, content)
        : await ChatService.sendChannelMessage(currentChat.id, content);
      setMessages(prevMessages => [...prevMessages, data]);
    } catch (err) {
      setError(err.message);
    }
  }, [currentChat, chatType]);

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
    sendMessage,
  };
};