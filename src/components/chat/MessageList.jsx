import React, { useEffect, useRef } from "react";

const MessageList = ({ messages = [], userId }) => {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!Array.isArray(messages)) {
    console.error("MessageList expects an array for messages but got:", messages);
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 p-4 overflow-y-auto h-full bg-gray-100">
      {messages.length > 0 ? (
        messages.map((msg, index) => {
          const isMe = msg.senderId === userId;
          return (
            <div
              key={index}
              className={`p-3 rounded-xl max-w-[75%] ${
                isMe ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 block text-right">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No messages</p>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
