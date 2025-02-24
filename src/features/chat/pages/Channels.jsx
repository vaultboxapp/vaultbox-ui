import { useCallback, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useWebSocket } from "../hooks/useWebSocket";
import ChatLayout from "../components/ChatLayout";
import { useAuth } from "@login/context/auth";

const Channels = () => {
  const {
    chats: channels,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    users,
    error,
    fetchMessages,
    uploadFile,
  } = useChat("channel");
  const { user } = useAuth();
  const userId = user?.id;

  if (!user || !userId) {
    return <div>Loading user data...</div>;
  }

  // Revised callback: Enrich incoming realtime messages with sender's username if missing.
  const handleGrpMessage = useCallback(
    (newMsg) => {
      console.log("New group message received:", newMsg);
      let enrichedMsg = newMsg;
      if (!newMsg.senderName) {
        const sender = users.find(
          (u) => String(u._id) === String(newMsg.senderId)
        );
        enrichedMsg = { ...newMsg, senderName: sender?.username || "Unknown" };
      }
      if (currentChat && enrichedMsg.channelId === currentChat._id) {
        setMessages((prev) => [...prev, enrichedMsg]);
      }
    },
    [currentChat, setMessages, users]
  );

  // Pass the enriched realtime handler to useWebSocket.
  const { sendMessage } = useWebSocket(userId, handleGrpMessage);

  const handleSendMessage = (content) => {
    if (!currentChat) return;
    const messagePayload = {
      type: "channel_message",
      channelId: currentChat._id,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    };
    sendMessage(messagePayload);
    setMessages((prev) => [...prev, messagePayload]);
  };

  // Fetch messages when currentChat changes.
  useEffect(() => {
    if (currentChat) {
      setMessages([]);
      fetchMessages(currentChat);
    }
  }, [currentChat, fetchMessages, setMessages]);

  if (error) return <div>Error: {error}</div>;

  return (
    <ChatLayout
      chatType="channel"
      chats={channels}
      currentChat={currentChat}
      setCurrentChat={setCurrentChat}
      messages={messages}
      onSendMessage={handleSendMessage}
      onFileUpload={uploadFile}
      userId={userId}
    />
  );
};

export default Channels;
