"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, Image, Smile } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"

const MessageInput = ({ onSendMessage, onFileUpload, isTyping }) => {
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      try {
        await onFileUpload(file)
      } catch (error) {
        console.error("File upload failed:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="border-t bg-background p-4">
      {isTyping && <div className="mb-2 text-sm text-muted-foreground">Someone is typing...</div>}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,video/*,application/pdf"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send image</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button type="submit" size="icon" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default MessageInput

