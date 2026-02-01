import { api } from "../api/api";
import { USER_API,OWNER_API, ADMIN_API } from "../constants/apiRoutes";
import { NotificationDto } from "../types/notification";


type Role = "User" | "Owner" | "Admin";

const getApiByRole = (role: Role) => {
  switch (role) {
    case "Owner":
      return OWNER_API;
    case "Admin":
      return ADMIN_API;
    default:
      return USER_API;
  }
};

export const notificationService = {
  getNotifications: async (role: Role = "User"): Promise<NotificationDto[]> => {
    const API = getApiByRole(role);
    const res = await api.get(API.NOTIFICATIONS);
    return res.data.data;
  },



  markAsRead: async(notificationId:string, role:Role='User'): Promise<NotificationDto>  =>{
    const API =getApiByRole(role);
    const res= await api.patch(API.MARK_NOTIFICATION_READ(notificationId));
    return res.data.data;
  },

markAllAsRead:async(role:Role="User"):Promise<number>=>{
  const API = getApiByRole(role);
  const res = await api.patch(API.MARK_ALL_NOTIFICATIONS_READ);
  return res.data.updatedCount;
},

  deleteNotification: async (notificationId: string, role:Role='User'): Promise<void>=> { 
    const API = getApiByRole(role);
    await api.delete(API.DELETE_NOTIFICATION(notificationId));
  },
}