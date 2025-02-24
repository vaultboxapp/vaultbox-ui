"use client";

import { useChat } from "../hooks/useChat";
import { useWebSocket } from "../hooks/useWebSocket";
import ChatLayout from "../components/ChatLayout";
import { useAuth } from "@login/context/auth";
import { useCallback } from "react";

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

  if (!user || !userId) {
    return <div>Loading user data...</div>;
  }

  // Handle incoming direct messages and enrich with senderName if missing.
  const handleIncomingMessage = useCallback(
    (newMsg) => {
      console.log("New direct message:", newMsg);
      // If senderName is missing, try to set it:
      if (!newMsg.senderName) {
        if (newMsg.senderId === userId) {
          newMsg.senderName = "You";
        } else if (currentChat && currentChat.username) {
          newMsg.senderName = currentChat.username;
        } else {
          newMsg.senderName = "Unknown";
        }
      }
      setMessages((prev) => [...prev, newMsg]);
    },
    [setMessages, userId, currentChat]
  );

  const { sendMessage: sendWebSocketMessage } = useWebSocket(
    userId,
    handleIncomingMessage
  );

  // When sending a message, include senderName from the current user.
  const handleSendMessage = useCallback(
    (content) => {
      if (!currentChat) return;
      const messagePayload = {
        type: "direct_message",
        senderId: userId,
        // For direct chat, currentChat is assumed to be the conversation partner.
        receiverId: currentChat._id,
        content,
        createdAt: new Date().toISOString(),
        // Attach your username for outgoing messages.
        senderName: user.username,
      };
      sendWebSocketMessage(messagePayload);
      setMessages((prev) => [...prev, messagePayload]);
    },
    [currentChat, userId, user.username, sendWebSocketMessage, setMessages]
  );

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
      messages={messages}
      onSendMessage={handleSendMessage}
      onFileUpload={uploadFile}
      userId={userId}
    />
  );
};

export default Messages;
