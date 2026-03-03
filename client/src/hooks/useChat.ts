import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { socketService } from '../socket/socketService';

interface UseChatOptions {
  otherUserId: string;
  otherUserModel: 'User' | 'Owner';
  propertyId: string;
  role: 'user' | 'owner';
}

export const useChat = ({ otherUserId, otherUserModel, propertyId, role }: UseChatOptions) => {
  const {
    messages,
    messageLoading,
    fetchConversation,
    addMessage,
    markMessagesRead,
    setTyping,
    setUserOnline,
    setUserOffline,
    typingUsers,
    onlineUsers,
    clearMessages,
    userData,
  } = useAuthStore();

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    
    socketService.connect();
    socketService.joinRoom(otherUserId, propertyId);

    
    fetchConversation(otherUserId, propertyId, role);

    
    markMessagesRead(otherUserId, propertyId, role);
    socketService.markRead(otherUserId, propertyId);

    
    socketService.onReceiveMessage((message) => {
      addMessage(message);
      
      if (message.sender === otherUserId) {
        socketService.markRead(otherUserId, propertyId);
      }
    });

    socketService.onTyping(({ senderId, propertyId: pid }) => {
      setTyping(senderId, pid, true);
    });

    socketService.onStopTyping(({ senderId, propertyId: pid }) => {
      setTyping(senderId, pid, false);
    });

    socketService.onUserOnline(({ userId }) => setUserOnline(userId));
    socketService.onUserOffline(({ userId }) => setUserOffline(userId));

    return () => {
      socketService.off('chat:receive');
      socketService.off('chat:typing');
      socketService.off('chat:stop_typing');
      socketService.off('user:online');
      socketService.off('user:offline');
      clearMessages();
    };
  }, [otherUserId, propertyId]);

  const sendMessage = (content: string, image?: string) => {
    socketService.sendMessage({
      receiverId: otherUserId,
      receiverModel: otherUserModel,
      propertyId,
      content,
      image,
    });
  };

  const handleTyping = () => {
    socketService.sendTyping(otherUserId, propertyId);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(otherUserId, propertyId);
    }, 1500);
  };

  const isOtherUserTyping = typingUsers[`${otherUserId}_${propertyId}`] ?? false;
  const isOtherUserOnline = onlineUsers.has(otherUserId);

  return {
    messages,
    messageLoading,
    sendMessage,
    handleTyping,
    isOtherUserTyping,
    isOtherUserOnline,
  };
};