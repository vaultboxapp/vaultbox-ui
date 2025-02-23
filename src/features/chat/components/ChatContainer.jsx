"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import ChatList from "./ChatList"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import ChannelInfo from "./ChannelInfo"
import { sortMessagesByDate } from "@/lib/utils"
import UserProfile from "./UserProfile" // Import UserProfile

const ChatContainer = ({ chatType = "direct", userId, initialChats = [], onSendMessage, onFileUpload }) => {
  const [chats, setChats] = useState(initialChats)
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const { toast } = useToast()

  // Sort messages by date whenever they change
  useEffect(() => {
    setMessages((prevMessages) => sortMessagesByDate(prevMessages))
  }, [])

  const handleChatSelect = (chat) => {
    setCurrentChat(chat)
    setShowInfo(false)
    // Reset unread count when selecting chat
    setChats((prevChats) => prevChats.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c)))
  }

  const handleNewMessage = (message) => {
    // Add message to current chat
    setMessages((prev) => sortMessagesByDate([...prev, message]))

    // If message is not from current user, show notification
    if (message.senderId !== userId) {
      // Update unread count if message is for a different chat
      if (!currentChat || message.chatId !== currentChat._id) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === message.chatId ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 } : chat,
          ),
        )

        // Show toast notification
        toast({
          title: `New message from ${message.senderName}`,
          description: message.content.substring(0, 50) + (message.content.length > 50 ? "..." : ""),
          duration: 3000,
        })
      }
    }
  }

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {/* Fixed-width chat list */}
      <div className="w-80 flex-shrink-0 border-r bg-background">
        <ScrollArea className="h-full">
          <ChatList chats={chats} currentChat={currentChat} onChatSelect={handleChatSelect} chatType={chatType} />
        </ScrollArea>
      </div>

      {/* Main chat area with fixed width and proper scrolling */}
      <div className="flex flex-1 flex-col min-w-0">
        {currentChat ? (
          <>
            <ChatHeader chat={currentChat} chatType={chatType} onInfoClick={() => setShowInfo(true)} />
            <div className="flex-1 min-h-0">
              <MessageList messages={messages} userId={userId} />
            </div>
            <MessageInput
              onSendMessage={(content) => {
                const message = {
                  id: Date.now(),
                  content,
                  senderId: userId,
                  chatId: currentChat._id,
                  createdAt: new Date().toISOString(),
                }
                onSendMessage(message)
                handleNewMessage(message)
              }}
              onFileUpload={onFileUpload}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Select a {chatType} to start chatting</p>
          </div>
        )}
      </div>

      {/* Channel/User info sheet */}
      <Sheet open={showInfo} onOpenChange={setShowInfo}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          {currentChat && chatType === "channel" ? (
            <ChannelInfo channel={currentChat} />
          ) : (
            <UserProfile user={currentChat} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ChatContainer

