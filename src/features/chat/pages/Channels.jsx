"use client"

import { useCallback, useEffect } from "react"
import { useChat } from "../hooks/useChat"
import { useWebSocket } from "../hooks/useWebSocket"
import ChatLayout from "../components/ChatLayout"
import { useAuth } from "@login/context/auth"

const Channels = () => {
  const {
    chats: channels,
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    error,
    fetchMessages,
    uploadFile,
  } = useChat("channel")

  const { user } = useAuth()
  const userId = user?.id

  // Debug logs
 // console.log("Current user:", user)
 // console.log("Current userId:", userId)

  // Wait for user to be loaded
  if (!user || !userId) {
    return <div>Loading user data...</div>
  }

  const handleGrpMessage = useCallback(
    (newMsg) => {
      console.log("New group message received:", newMsg)
      if (currentChat && newMsg.channelId === currentChat._id) {
        setMessages((prev) => [...prev, newMsg])
      }
    },
    [currentChat, setMessages]
  )

  const { sendMessage } = useWebSocket(userId, handleGrpMessage)

  const handleSendMessage = (content) => {
    if (!currentChat) return
    const messagePayload = {
      type: "channel_message",
      channelId: currentChat._id,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    }
    sendMessage(messagePayload)
    setMessages((prev) => [...prev, messagePayload])
  }

  // Fetch messages when currentChat changes
  useEffect(() => {
    if (currentChat) {
      setMessages([])
      fetchMessages(currentChat)
    }
  }, [currentChat, fetchMessages, setMessages])

  if (error) return <div>Error: {error}</div>

  return (
    <ChatLayout
      chatType="channel"
      chats={channels}
      currentChat={currentChat}
      setCurrentChat={(channel) => {
        setCurrentChat(channel)
      }}
      messages={messages}
      onSendMessage={handleSendMessage}
      onFileUpload={uploadFile}
      userId={userId}
    />
  )
}

export default Channels