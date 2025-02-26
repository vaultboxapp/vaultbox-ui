"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWebSocket } from "../chat/hooks/useWebSocket";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("notifications");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate overall unread notifications (could be used for a global counter)
  useEffect(() => {
    setUnreadCount(notifications.filter((notif) => !notif.read).length);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // addNotification now supports notifications with extra fields like chatType and chatId.
  const addNotification = useCallback((notification) => {
    // Optionally, ignore notifications that originate from yourself
    // e.g., if(notification.senderId === currentUserId) return;
    if (notification.senderId === userId) {
      // Skip self messages
      return;
    }
    
    const newNotification = {
      id: Date.now(),
      read: false,
      timestamp: Date.now(),
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    if (Notification.permission === "granted") {
      new Notification(notification.title || "New Notification", {
        body: notification.message || notification.content || "",
      });
    }
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mark notifications for a specific chat (channel or direct) as read.
  const markChatNotificationsAsRead = useCallback((chatId) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.chatId === chatId ? { ...notif, read: true } : notif))
    );
  }, []);

  // Initialize WebSocket – note we pass null for onIncomingMessage and addNotification for onNotification.
  useWebSocket(userId, null, addNotification);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        markChatNotificationsAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotifications() {
  return useContext(NotificationsContext);
}
