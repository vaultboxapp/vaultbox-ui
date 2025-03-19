"use client"

import React, { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { FileIcon, ImageIcon, FileVideo, File } from "lucide-react"
import { Button } from "@/components/ui/button"

const MessageList = ({ messages = [], userId }) => {
  const scrollRef = useRef(null)
  const containerRef = useRef(null)

  // Scroll to bottom on initial load and whenever messages change.
  useEffect(() => {
    // Option 1: Scroll container directly
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
    // Option 2 (preferred): Scroll dummy element into view with smooth behavior
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, userId])

  const formatMessageTime = (date) => {
    return format(new Date(date), "HH:mm")
  }

  const renderDateDivider = (date) => {
    return (
      <div className="flex items-center my-4" key={date}>
        <div className="flex-1 border-t"></div>
        <span className="mx-4 text-xs text-muted-foreground">{format(new Date(date), "MMMM d, yyyy")}</span>
        <div className="flex-1 border-t"></div>
      </div>
    )
  }

  const renderAttachment = (file) => {
    // Determine file type for proper rendering
    const fileType = file.type?.split('/')[0] || 'unknown';
    const fileName = file.name || 'File';
    const fileUrl = file.url || '#';
    
    // Handle different file types
    switch(fileType) {
      case 'image':
        return (
          <div className="mt-2 max-w-xs">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <img 
                src={fileUrl} 
                alt={fileName} 
                className="rounded-md max-h-32 object-cover border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                }}
              />
            </a>
            <div className="text-xs text-muted-foreground mt-1 flex items-center">
              <ImageIcon className="h-3 w-3 mr-1" />
              <span className="truncate">{fileName}</span>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="mt-2">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border p-2 bg-muted/50 hover:bg-muted"
            >
              <FileVideo className="h-4 w-4" />
              <span className="text-sm truncate">{fileName}</span>
            </a>
          </div>
        );
      
      default:
        return (
          <div className="mt-2">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border p-2 bg-muted/50 hover:bg-muted"
            >
              <FileIcon className="h-4 w-4" />
              <span className="text-sm truncate">{fileName}</span>
            </a>
          </div>
        );
    }
  }

  // Debug log to see what's in the messages
  console.log("Messages data:", messages);

  return (
    <ScrollArea className="h-full" ref={containerRef}>
      <div className="flex flex-col p-4 gap-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === userId
          const showDateDivider =
            index === 0 ||
            format(new Date(message.createdAt), "yyyy-MM-dd") !==
              format(new Date(messages[index - 1]?.createdAt), "yyyy-MM-dd")

          return (
            <React.Fragment key={message._id || index}>
              {showDateDivider && renderDateDivider(message.createdAt)}
              <div
                className={`flex gap-3 max-w-[85%] ${
                  isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                }`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`group flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                  <span className="text-sm text-muted-foreground mb-1">
                    {isCurrentUser ? "You" : message.senderName || "Unknown"}
                  </span>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                    <span className="ml-2 inline-block text-xs opacity-0 transition-opacity group-hover:opacity-60">
                      {formatMessageTime(message.createdAt)}
                    </span>
                    
                    {/* Render file attachments if present */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((file, i) => (
                          <div key={i}>{renderAttachment(file)}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })}
        {/* Dummy element for auto-scrolling */}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}

export default MessageList

