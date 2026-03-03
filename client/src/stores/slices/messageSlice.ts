
import { StateCreator } from 'zustand';
//import { MessageDTO, ConversationListItem } from '../../types/message';
import { MessageResponseDTO, ConversationListDTO } from '../../types/message';
import { messageService } from '../../services/messageService';

export interface MessageSlice {
  // messages: MessageDTO[];
  messages: MessageResponseDTO[];
  // conversationList: ConversationListItem[];
  conversationList: ConversationListDTO[];
  messageLoading: boolean;
  messageError: string | null;
  typingUsers: Record<string, boolean>; // key: senderId_propertyId
  onlineUsers: Set<string>;

  fetchConversation: (ownerId: string, propertyId: string, role: 'user' | 'owner') => Promise<void>;
  fetchConversationList: (role: 'user' | 'owner') => Promise<void>;
  //addMessage: (message: MessageDTO) => void;
  addMessage: (message: MessageResponseDTO) => void;
  markMessagesRead: (senderId: string, propertyId: string, role: 'user' | 'owner') => Promise<void>;
  setTyping: (senderId: string, propertyId: string, isTyping: boolean) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  clearMessages: () => void;
}

export const createMessageSlice: StateCreator<MessageSlice> = (set, get) => ({
  messages: [],
  conversationList: [],
  messageLoading: false,
  messageError: null,
  typingUsers: {},
  onlineUsers: new Set(),

  fetchConversation: async (ownerId, propertyId, role) => {
    set({ messageLoading: true, messageError: null });
    try {
      const messages = await messageService.getConversation(ownerId, propertyId, role);
      set({ messages, messageLoading: false });
    } catch (err: any) {
      set({ messageError: err.message || 'Failed to fetch messages', messageLoading: false });
    }
  },

  fetchConversationList: async (role) => {
    set({ messageLoading: true });
    try {
      const conversationList = await messageService.getConversationList(role);
      set({ conversationList, messageLoading: false });
    } catch (err: any) {
      set({ messageError: err.message, messageLoading: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  markMessagesRead: async (senderId, propertyId, role) => {
    try {
      await messageService.markAsRead(senderId, propertyId, role);
      set((state) => ({
        messages: state.messages.map((m) =>
          // m.sender === senderId && m.propertyId === propertyId ? { ...m, isRead: true } : m
          m.senderId === senderId && m.propertyId === propertyId ? { ...m, isRead: true } : m
        ),
      }));
    } catch (err: any) {
      console.error('markMessagesRead failed', err);
    }
  },

  setTyping: (senderId, propertyId, isTyping) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [`${senderId}_${propertyId}`]: isTyping },
    }));
  },

  setUserOnline: (userId) => {
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.add(userId);
      return { onlineUsers: updated };
    });
  },

  setUserOffline: (userId) => {
    set((state) => {
      const updated = new Set(state.onlineUsers);
      updated.delete(userId);
      return { onlineUsers: updated };
    });
  },

  clearMessages: () => set({ messages: [] }),
});