// // services/chatService.ts
// import { api } from "../api/api";
// import { USER_API, OWNER_API } from "../constants/apiRoutes";
// import { SendMessageDto } from "../types/message";

// export const messageService = {
//   getChat: async (propertyId: string, ownerId: string) => {
//     const res = await api.get(`/user/chat/${propertyId}/${ownerId}`);
//     return res.data.data;
//   },

//   sendMessage: async (payload: SendMessageDto) => {
//     const res = await api.post("/user/chat/send", payload);
//     return res.data.data;
//   },

//   markMessageAsRead: async (payload: {
//     senderId: string;
//     receiverId: string;
//     propertyId: string;
//   }) => {
//     const res = await api.patch("/user/chat/read", payload);
//     return res.data;
//   },

//   getOwnerChat: async (propertyId: string, ownerId: string) => {
//     const res = await api.get(`/owner/chat/${propertyId}/${ownerId}`);
//     return res.data.data;
//   },

//   sendOwnerMessage: async (payload: SendMessageDto) => {
//     const res = await api.post("/owner/chat/send", payload);
//     return res.data.data;
//   },

//   markOwnerMessageAsRead: async (payload: {
//     senderId: string;
//     receiverId: string;
//     propertyId: string;
//   }) => {
//     const res = await api.patch("/owner/chat/read", payload);
//     return res.data;
//   },

// };


import { api } from '../api/api';
import { USER_API, OWNER_API } from '../constants/apiRoutes';

export const messageService = {
  getConversation: async (ownerId: string, propertyId: string, role: 'user' | 'owner') => {
    const url = role === 'owner'
      ? OWNER_API.CONVERSATION(ownerId, propertyId)
      : USER_API.CONVERSATION(ownerId, propertyId);
    const res = await api.get(url);
    return res.data.messages;
  },

  getConversationList: async (role: 'user' | 'owner') => {
    const url = role === 'owner' ? OWNER_API.MESSAGES : USER_API.MESSAGES;
    const res = await api.get(url);
    return res.data.conversations;
  },

  markAsRead: async (senderId: string, propertyId: string, role: 'user' | 'owner') => {
    const url = role === 'owner' ? OWNER_API.MARK_READ : USER_API.MARK_READ;
    await api.post(url, { senderId, propertyId });
  },
};