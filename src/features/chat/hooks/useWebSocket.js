import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (userId, onGrpMessage) => {
  const ws = useRef(null);
  const stableUserId = useRef(userId);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (ws.current?.connected) return;

    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
    }

    // Use relative URL so Vite's proxy forwards the connection
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

    ws.current.on("grpMessage", (newMsg) => {
      console.log("Received grpMessage:", newMsg);
      if (onGrpMessage) onGrpMessage(newMsg);
    });

    ws.current.on("disconnect", (reason) => {
      console.warn("WebSocket disconnected:", reason);
    });

    ws.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      // Let socket.io handle reconnection automatically.
    });
  }, [onGrpMessage]);

  useEffect(() => {
    isMounted.current = true;
    connect();
    return () => {
      isMounted.current = false;
      if (ws.current) {
        console.log("Disconnecting WebSocket");
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((payload) => {
    if (ws.current?.connected) {
      console.log("Sending grpMessage:", payload);
      ws.current.emit("grpMessage", payload);
    } else {
      console.warn("WebSocket not connected; message not sent");
    }
  }, []);

  return { sendMessage };
};
