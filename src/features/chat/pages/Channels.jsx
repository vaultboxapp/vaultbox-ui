import { useCallback, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useWebSocket } from "../hooks/useWebSocket";
import ChatLayout from "../components/ChatLayout";
import { useAuth } from "@login/context/auth";
import { useNotifications } from "../../notifications/NotificationContext";

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
  const { addNotification } = useNotifications();
  const userId = user?.id;

  if (!user || !userId) {
    return <div>Loading user data...</div>;
  }

  // Handle incoming group messages.
  const handleGrpMessage = useCallback(
    (newMsg) => {
      console.log("New group message received:", newMsg);
      if (!newMsg.senderName) {
        const sender = users.find((u) => String(u._id) === String(newMsg.senderId));
        newMsg.senderName = sender ? sender.username : "Unknown";
      }
      if (currentChat && newMsg.channelId === currentChat._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    },
    [currentChat, setMessages, users]
  );

  // Handle incoming notifications.
  const handleNotification = useCallback(
    (notificationData) => {
      console.log("New notification received:", notificationData);
      // Map content to message if message isn't provided.
      addNotification({
        ...notificationData,
        message: notificationData.message || notificationData.content,
      });
    },
    [addNotification]
  );

  const { sendMessage } = useWebSocket(userId, handleGrpMessage, handleNotification);

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
    setMessages((prev) => [
      ...prev,
      { ...messagePayload, senderName: user.username },
    ]);
  };

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
