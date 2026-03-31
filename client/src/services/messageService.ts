import { api } from "../api/api";
import { USER_API, OWNER_API } from "../constants/apiRoutes";

export const messageService = {
  getConversation: async (
    ownerId: string,
    propertyId: string,
    role: "user" | "owner",
  ) => {
    const url =
      role === "owner"
        ? OWNER_API.CONVERSATION(ownerId, propertyId)
        : USER_API.CONVERSATION(ownerId, propertyId);
    const res = await api.get(url);
    return res.data.messages;
  },

  getConversationList: async (role: "user" | "owner") => {
    const url = role === "owner" ? OWNER_API.MESSAGES : USER_API.MESSAGES;
    const res = await api.get(url);
    return res.data.conversations;
  },

  markAsRead: async (
    senderId: string,
    propertyId: string,
    role: "user" | "owner",
  ) => {
    const url = role === "owner" ? OWNER_API.MARK_READ : USER_API.MARK_READ;
    await api.post(url, { senderId, propertyId });
  },
};
