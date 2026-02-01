import { StateCreator } from "zustand";
import { notificationService } from "../../services/notificationService";
import { NotificationDto } from "../../types/notification";

export interface NotificationSlice {
     notifications: NotificationDto[];
     unreadCount: number;
     notificationLoading: boolean;
     notificationError: string | null;

     //fetchNotifications: () => Promise<void>;
     fetchNotifications: (role?: 'User' | 'Owner' | 'Admin') => Promise<void>;
     markAsRead: (notificationId: string, role?: "User" | "Owner" | "Admin") => Promise<void>;
     markAllAsRead: (role?: "User" | "Owner" | "Admin") => Promise<void>;
     deleteNotification: (notificationId: string, role?: "User" | "Owner" | "Admin") => Promise<void>;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (set) => ({

    notifications: [],
    unreadCount: 0,
    notificationLoading: false,
    notificationError: null,

fetchNotifications: async (role: 'User' | 'Owner' | 'Admin' = 'User') => {
    set({ notificationLoading: true, notificationError: null });
    try {
      const notifications = await notificationService.getNotifications(role);
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount });
    } catch (err: any) {
      set({ notificationError: err.message || "Failed to fetch notifications" });
    } finally {
      set({ notificationLoading: false });
    }
  },

markAsRead: async (notificationId: string, role: "User" | "Owner" | "Admin" = "User") => {
    try {
      await notificationService.markAsRead(notificationId, role);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });
    } catch (err: any) {
      set({ notificationError: err.message || "Failed to mark notification as read" });
    }
  },

 
  markAllAsRead: async (role: "User" | "Owner" | "Admin" = "User") => {
    try {
      await notificationService.markAllAsRead(role);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (err: any) {
      set({ notificationError: err.message || "Failed to mark all notifications as read" });
    }
  },

  
  deleteNotification: async (notificationId: string, role: "User" | "Owner" | "Admin" = "User") => {
    try {
      await notificationService.deleteNotification(notificationId, role);
      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== notificationId);
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.read).length,
        };
      });
    } catch (err: any) {
      set({ notificationError: err.message || "Failed to delete notification" });
    }
  },


});