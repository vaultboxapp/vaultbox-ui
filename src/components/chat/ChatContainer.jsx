import React, { useState } from "react";
import ChatList from "./ChatList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChat } from "@/hooks/useChat";
import { useWebSocket } from "@/hooks/useWebSocket";

const ChatContainer = ({ chatType = "direct" }) => {
  // Our chat hook provides chats, messages, loading, error, etc.
  const {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    fetchMessages,
    loading,
    error,
    // (Assuming your hook supports sending messages via HTTP if needed)
    sendMessage: sendMessageHTTP,
  } = useChat(chatType);

  // Use the WebSocket hook to receive/send messages in real time.
  const { sendMessage: sendMessageWS } = useWebSocket(1, (msg) => {
    console.log("Received WebSocket message:", msg);
    // You might update your local messages state here (e.g. via a context or directly in your hook)
    // For simplicity, you could call fetchMessages(currentChat.id) again if appropriate.
  });

  // Handle sending a message by invoking both WebSocket and HTTP (if required)
  const handleSendMessage = (payload) => {
    sendMessageWS(payload);

  };

  return (
    <div className="flex h-screen">
      <ChatList
        chats={chats}
        currentChat={currentChat}
        onChatSelect={(chat) => {
          setCurrentChat(chat);
          fetchMessages(chat.id);
        }}
        chatType={chatType}
      />
      <div className="flex flex-col flex-grow">
        <div className="flex-grow overflow-y-auto">
          <MessageList messages={messages} />
        </div>
        <MessageInput sendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
