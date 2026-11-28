
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAllNotificationsAPI,
  getUnreadNotificationCountAPI,
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
  deleteNotificationAPI,
} from "@/services/notificationService";

import { NotificationItem } from "../components/types/notification";
import { getSocket } from "@/services/lib/socket";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const [notificationResponse, countResponse] =
        await Promise.all([
          getAllNotificationsAPI(1, 20),
          getUnreadNotificationCountAPI(),
        ]);

      const notificationData =
        notificationResponse.data?.notifications ??
        notificationResponse.data?.data ??
        notificationResponse.notifications ??
        notificationResponse.data ??
        [];

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );

      setUnreadCount(
        countResponse.count ??
        countResponse.data?.count ??
        countResponse.data?.unreadCount ??
        0
      );
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // SOCKET REAL-TIME NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    loadNotifications();

    const socket = getSocket();

    const handleNewNotification = (
      notification: NotificationItem
    ) => {
      setNotifications((previous) => {
        const exists = previous.some(
          (item) => item.id === notification.id
        );

        if (exists) {
          return previous;
        }

        return [notification, ...previous].slice(0, 20);
      });

      if (!notification.isRead) {
        setUnreadCount((previous) => previous + 1);
      }
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [loadNotifications]);

  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================

  const markAsRead = async (id: number) => {
    try {
      const notification = notifications.find(
        (item) => item.id === id
      );

      if (!notification || notification.isRead) {
        return;
      }

      await markNotificationAsReadAPI(id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );
    } catch (error) {
      console.error("Mark notification as read failed:", error);
    }
  };

  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================

  const markAllAsRead = async () => {
    try {
      if (unreadCount === 0) {
        return;
      }

      await markAllNotificationsAsReadAPI();

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all as read failed:", error);
    }
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const deleteNotification = async (id: number) => {
    try {
      const notification = notifications.find(
        (item) => item.id === id
      );

      await deleteNotificationAPI(id);

      setNotifications((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (notification && !notification.isRead) {
        setUnreadCount((previous) =>
          Math.max(0, previous - 1)
        );
      }
    } catch (error) {
      console.error("Delete notification failed:", error);
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
