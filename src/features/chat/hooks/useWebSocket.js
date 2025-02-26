import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (userId, onIncomingMessage, onNotification) => {
  const ws = useRef(null);
  const stableUserId = useRef(userId);

  const connect = useCallback(() => {
    if (ws.current?.connected) return;
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
    }
    ws.current = io("/", {
      path: "/chat/socket.io",
      transports: ["websocket"],
      query: { userId: stableUserId.current },
      withCredentials: true,
      extraHeaders: { Cookie: document.cookie },
      autoConnect: true,
      reconnection: true,
    });

    ws.current.on("connect", () => {
      console.log("WebSocket connected");
      ws.current.emit("authenticate", { userId: stableUserId.current });
    });

    ws.current.on("grpMessage", (msg) => {
      console.log("Received grpMessage:", msg);
      if (onIncomingMessage) onIncomingMessage(msg);
    });

    ws.current.on("message", (msg) => {
      console.log("Received direct message:", msg);
      if (onIncomingMessage) onIncomingMessage(msg);
    });

    ws.current.on("notification", (notificationData) => {
      console.log("Received notification:", notificationData);
      if (onNotification) onNotification(notificationData);
    });

    ws.current.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });

    ws.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
  }, [onIncomingMessage, onNotification]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        console.log("Disconnecting WebSocket");
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [connect]);

  // When sending a message, decide event based on payload type.
  const sendMessage = useCallback((payload) => {
    if (ws.current?.connected) {
      console.log("Sending message:", payload);
      if (payload.type === "direct_message") {
        ws.current.emit("message", payload);
      } else {
        ws.current.emit("grpMessage", payload);
      }
    } else {
      console.warn("WebSocket not connected; message not sent");
    }
  }, []);

  return { sendMessage };
};
