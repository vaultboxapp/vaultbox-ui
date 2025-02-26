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

  useEffect(() => {
    setUnreadCount(notifications.filter((notif) => !notif.read).length);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification) => {
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

  // WebSocket Integration
  useWebSocket(userId, null, addNotification);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead: (id) =>
          setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
          ),
        markAllAsRead: () => setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true }))),
        clearNotifications: () => setNotifications([]),
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export function useNotifications() {
  return useContext(NotificationsContext);
}
