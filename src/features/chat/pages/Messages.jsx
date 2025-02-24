"use client"

import { useChat } from "../hooks/useChat"
import { useWebSocket } from "../hooks/useWebSocket"
import ChatLayout from "../components/ChatLayout"
import { useAuth } from "@login/context/auth"

const Messages = () => {
  const { chats, currentChat, setCurrentChat, messages, setMessages, error, fetchMessages, uploadFile } =
    useChat("direct")

  const { user } = useAuth()
  const userId = user?.id

  // console.log("Current user:", user)
  // console.log("Current userId:", userId)

  // Wait for user to be loaded
  if (!user || !userId) {
    return <div>Loading user data...</div>
  }

  const handleIncomingMessage = (newMsg) => {
    console.log("New direct message:", newMsg)
    setMessages((prev) => [...prev, newMsg])
  }

  const { sendMessage: sendWebSocketMessage } = useWebSocket(userId, handleIncomingMessage)

  const handleSendMessage = (content) => {
    if (!currentChat) return
    const messagePayload = {
      type: "direct_message",
      senderId: userId,
      receiverId: currentChat._id,
      content,
      createdAt: new Date().toISOString(),
    }
    sendWebSocketMessage(messagePayload)
    setMessages((prev) => [...prev, messagePayload])
  }

  if (error) return <div>Error: {error}</div>

  return (
    <ChatLayout
      chatType="direct"
      chats={chats}
      currentChat={currentChat}
      setCurrentChat={(chat) => {
        setCurrentChat(chat)
        setMessages([])
        fetchMessages(chat)
      }}
      messages={messages}
      onSendMessage={handleSendMessage}
      onFileUpload={uploadFile}
      userId={userId}
    />
  )
}

export default Messages