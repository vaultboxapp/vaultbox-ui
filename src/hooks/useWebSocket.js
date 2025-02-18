// useWebSocket.js - Final Working Version
import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
export const useWebSocket = (userId, onMessage) => {
  const ws = useRef(null);
  const stableUserId = useRef(userId);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (ws.current?.connected) return;

    console.log("🌐 Establishing WebSocket connection...");
    
    // Cleanup previous connection
    if (ws.current) {
      ws.current.removeAllListeners();
      ws.current.disconnect();
    }

    // Create new connection with stable user ID
    ws.current = io("wss://vaultbox", {  // Remove "/chat" from URL
      path: "/socket.io",
      transports: ["websocket"],
      query: { userId: stableUserId.current },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      randomizationFactor: 0.5,
      timeout: 15000,
      upgrade: false,  // Force WebSocket-only transport
      forceNew: true,
      autoConnect: true,
      extraHeaders: {
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    // Connection handlers
    ws.current.on("connect", () => {
      console.log("✅ WebSocket connected");
      ws.current.emit("authenticate", { userId: stableUserId.current });
    });

    ws.current.on("message", onMessage);

    ws.current.on("connect_error", (error) => {
      console.error("🔌 Connection error:", error.message);
      if (isMounted.current) setTimeout(connect, 5000);
    });

    return () => {
      ws.current?.off("connect");
      ws.current?.off("message");
      ws.current?.off("connect_error");
    };
  }, [onMessage]);

  useEffect(() => {
    isMounted.current = true;
    connect();
    
    return () => {
      isMounted.current = false;
      if (ws.current) {
        console.log("🛑 Cleanup WebSocket connection");
        ws.current.disconnect();
        ws.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((payload) => {
    if (ws.current?.connected) {
      ws.current.emit("message", payload);
    } else {
      console.warn("Message queued - reconnecting...");
      setTimeout(() => sendMessage(payload), 1000);
    }
  }, []);

  return { sendMessage };
};