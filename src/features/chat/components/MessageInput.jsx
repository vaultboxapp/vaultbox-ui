"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, Image, Smile, Plus, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "sonner"

const MessageInput = ({ onSendMessage, onFileUpload, isTyping }) => {
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Display a dummy preview while "uploading"
        const tempId = Date.now().toString();
        const tempMessage = {
          _id: tempId,
          content: `Uploading ${file.name}...`,
          senderId: 'local-temp',
          senderName: 'You',
          createdAt: new Date().toISOString(),
          attachments: [{
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file), // Create temporary URL
            uploadProgress: 0
          }]
        };
        
        // Add temporary message to display
        setMessages(prev => [...prev, tempMessage]);
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setMessages(prev => {
            return prev.map(msg => {
              if (msg._id === tempId && msg.attachments?.[0]) {
                const progress = Math.min((msg.attachments[0].uploadProgress || 0) + 20, 100);
                return {
                  ...msg,
                  content: progress < 100 ? `Uploading ${file.name}... ${progress}%` : `Uploaded ${file.name}`,
                  attachments: [{
                    ...msg.attachments[0],
                    uploadProgress: progress
                  }]
                };
              }
              return msg;
            });
          });
        }, 500);
        
        // On a real implementation, you would wait for the backend response here
        await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate upload time
        
        clearInterval(progressInterval);
        
        // After "uploading" is done, update the message with the final state
        // In reality, you would use the URL returned from your backend
        const fileUrl = URL.createObjectURL(file); // This would be the presigned URL from backend
        
        await onFileUpload(file, fileUrl);
      }
      
      // Clear the file input
      e.target.value = '';
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      {isTyping && <div className="mb-2 text-sm text-muted-foreground">Someone is typing...</div>}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full"
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,video/*,application/pdf"
        />
        <TooltipProvider>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowOptions(!showOptions)}
              className="rounded-full"
              aria-label="More options"
            >
              {showOptions ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
            {showOptions && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg shadow-lg p-2 flex gap-2 z-10">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="rounded-full"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Send image">
                      <Image className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send image</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Add emoji">
                      <Smile className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add emoji</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
          <Button type="submit" size="icon" disabled={!message.trim()} className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </TooltipProvider>
      </form>
    </div>
  )
}

export default MessageInput
