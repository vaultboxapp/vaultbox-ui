import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { formatDate } from '../../utils/dateUtils';

export default function MessageList({ messages }) {
  const messagesEndRef = useRef(null);
  let currentDate = null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {messages.map((message) => {
        // Check if message has a timestamp, if not, use current date
        const messageDate = message.timestamp 
          ? new Date(message.timestamp).toDateString()
          : new Date().toDateString();
        const showDateSeparator = messageDate !== currentDate;
        currentDate = messageDate;

        return (
          <React.Fragment key={message.id}>
            {showDateSeparator && (
              <div className="text-center text-sm text-muted-foreground my-2">
                {formatDate(message.timestamp || new Date())}
              </div>
            )}
            <MessageItem message={message} />
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}