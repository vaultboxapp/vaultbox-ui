import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send } from 'lucide-react';
import FileUpload from './FileUpload';

export default function MessageInput({ onSendMessage, onFileUpload }) {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background">
      {showFileUpload && (
        <FileUpload onFileUpload={onFileUpload} onClose={() => setShowFileUpload(false)} />
      )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button type="button" variant="ghost" size="icon" onClick={() => setShowFileUpload(true)}>
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}