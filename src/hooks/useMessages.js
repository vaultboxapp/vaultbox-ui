import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessages, sendMessage as apiSendMessage, uploadFile as apiUploadFile } from '../data/messages';

export function useMessages(type) {
  const [messages, setMessages] = useState([]);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const isSendingRef = useRef(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const fetchedMessages = await getMessages(type);
      setMessages(fetchedMessages);
    };
    fetchMessages();
  }, [type]);

  const sendMessage = useCallback(async (content, recipientId) => {
    if (isSendingRef.current) return null;
    isSendingRef.current = true;
    try {
      const newMessage = await apiSendMessage(type, content, recipientId);
      const messageWithTimestamp = {
        ...newMessage,
        timestamp: newMessage.timestamp || new Date().toISOString()
      };
      setMessages(prevMessages => {
        const isDuplicate = prevMessages.some(msg => msg.id === messageWithTimestamp.id);
        return isDuplicate ? prevMessages : [...prevMessages, messageWithTimestamp];
      });
      return messageWithTimestamp;
    } finally {
      isSendingRef.current = false;
    }
  }, [type]);

  const uploadFile = useCallback(async (file, recipientId) => {
    if (isSendingRef.current) return null;
    isSendingRef.current = true;
    try {
      const uploadedFile = await apiUploadFile(type, file, recipientId);
      const fileWithDetails = {
        ...uploadedFile,
        name: file.name,
        type: file.type,
        size: file.size,
        timestamp: new Date().toISOString(),
        url: URL.createObjectURL(file)
      };
      setMessages(prevMessages => {
        const isDuplicate = prevMessages.some(msg => msg.id === fileWithDetails.id);
        return isDuplicate ? prevMessages : [...prevMessages, fileWithDetails];
      });
      setRecentDocuments(prevDocs => {
        const updatedDocs = [fileWithDetails, ...prevDocs];
        return updatedDocs.filter((doc, index, self) => 
          index === self.findIndex((t) => t.id === doc.id)
        ).slice(0, 5);
      });
      return fileWithDetails;
    } finally {
      isSendingRef.current = false;
    }
  }, [type]);

  return { messages, sendMessage, uploadFile, recentDocuments };
}