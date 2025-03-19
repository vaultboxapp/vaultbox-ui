import { useCallback, useEffect, useMemo } from "react";
import { useChat } from "../hooks/useChat";
import { useWebSocket } from "../hooks/useWebSocket";
import ChatLayout from "../components/ChatLayout";
import { useAuth } from "@login/context/auth";
import { useCipher } from '@/components/Layout/Layout';
import { encryptText } from "../utils/encryption";

const Messages = () => {
  const {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    error,
    fetchMessages,
    uploadFile,
  } = useChat("direct");

  const { user } = useAuth();
  const userId = user?.id;

  // Access cipher mode from context
  const { cipherMode } = useCipher();

  if (!user || !userId) {
    return <div>Loading user data...</div>;
  }

  // Handle incoming direct messages.
  const handleIncomingMessage = useCallback(
    (newMsg) => {
      console.log("New direct message:", newMsg);
      if (!newMsg.senderName) {
        if (newMsg.senderId === userId) {
          newMsg.senderName = "You";
        } else if (currentChat && currentChat.username) {
          newMsg.senderName = currentChat.username;
        } else {
          // Try to get the name from users list or use sender ID as fallback
          const sender = chats.find(chat => chat._id === newMsg.senderId);
          newMsg.senderName = sender ? sender.username : `User ${newMsg.senderId.slice(0,5)}`;
        }
      }
      setMessages((prev) => [...prev, newMsg]);
    },
    [setMessages, userId, currentChat, chats]
  );

  // Handle incoming notifications.
  const handleNotification = useCallback((notificationData) => {
    console.log("New notification received:", notificationData);
    // You can integrate with your notifications context here.
  }, []);

  const { sendMessage: sendWebSocketMessage } = useWebSocket(
    userId,
    handleIncomingMessage,
    handleNotification
  );

  const handleSendMessage = useCallback(
    (content) => {
      if (!currentChat) return;
      const messagePayload = {
        type: "direct_message",
        senderId: userId,
        receiverId: currentChat._id,
        content,
        createdAt: new Date().toISOString(),
        senderName: user.username,
      };
      sendWebSocketMessage(messagePayload);
      setMessages((prev) => [...prev, messagePayload]);
    },
    [currentChat, userId, user.username, sendWebSocketMessage, setMessages]
  );

  useEffect(() => {
    if (currentChat) {
      setMessages([]);
      fetchMessages(currentChat);
    }
  }, [currentChat, fetchMessages, setMessages]);

  // Transform messages with encrypted text if cipher mode is enabled
  const processedMessages = useMemo(() => {
    if (!cipherMode) return messages;
    
    return messages.map(message => ({
      ...message,
      content: encryptText(message.content, String(message._id || message.createdAt))
    }));
  }, [messages, cipherMode]);

  if (error) return <div>Error: {error}</div>;

  return (
    <ChatLayout
      chatType="direct"
      chats={chats}
      currentChat={currentChat}
      setCurrentChat={(chat) => {
        setCurrentChat(chat);
        setMessages([]);
        fetchMessages(chat);
      }}
      messages={processedMessages}
      onSendMessage={handleSendMessage}
      onFileUpload={uploadFile}
      userId={userId}
    />
  );
};

export default Messages;
