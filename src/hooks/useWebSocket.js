import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (userId, onGrpMessage) => {
  const ws = useRef(null);
  const stableUserId = useRef(userId);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (ws.current?.connected) return;

    // Cleanup any existing connection
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
    }

    ws.current = io("http://localhost:3000", {
      path: "/chat/socket.io",
      transports: ["websocket"],
      query: { userId: stableUserId.current },
      withCredentials: true,
      autoConnect: true,
    });

    ws.current.on("connect", () => {
      console.log("WebSocket connected");
      ws.current.emit("authenticate", { userId: stableUserId.current });
    });

    // Listen for group messages from the backend
    ws.current.on("grpMessage", (newMsg) => {
      console.log("Received grpMessage:", newMsg);
      if (onGrpMessage) onGrpMessage(newMsg);
    });

    ws.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (isMounted.current) setTimeout(connect, 5000);
    });

    return () => {
      ws.current?.off("connect");
      ws.current?.off("grpMessage");
      ws.current?.off("connect_error");
    };
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

  // Send group message using event "grpMessage"
  const sendMessage = useCallback((payload) => {
    if (ws.current?.connected) {
      console.log("Sending grpMessage:", payload);
      ws.current.emit("grpMessage", payload);
    } else {
      console.warn("WebSocket not connected, retrying...");
      setTimeout(() => sendMessage(payload), 1000);
    }
  }, []);

  return { sendMessage };
};
