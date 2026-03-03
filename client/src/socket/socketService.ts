import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    if (socket?.connected) return socket;
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    });  

 
  socket.on("connect", () => {
    console.log(" Socket connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.log(" Socket error:", err.message);
  });

    
    return socket;
  },

  disconnect: () => {
    socket?.disconnect();
    socket = null;
  },

  joinRoom: (otherUserId: string, propertyId: string) => {
    socket?.emit('chat:join', { otherUserId, propertyId });
  },

  sendMessage: (data: {
    receiverId: string;
    receiverModel: 'User' | 'Owner';
    propertyId: string;
    content?: string;
    image?: string;
  }) => {
    socket?.emit('chat:send', data);
  },

  markRead: (senderId: string, propertyId: string) => {
    socket?.emit('chat:read', { senderId, propertyId });
  },

  sendTyping: (receiverId: string, propertyId: string) => {
    socket?.emit('chat:typing', { receiverId, propertyId });
  },

  stopTyping: (receiverId: string, propertyId: string) => {
    socket?.emit('chat:stop_typing', { receiverId, propertyId });
  },

  onReceiveMessage: (cb: (message: any) => void) => {
    socket?.on('chat:receive', cb);
  },

  onNotification: (cb: (data: any) => void) => {
    socket?.on('chat:notification', cb);
  },

  onReadAck: (cb: (data: any) => void) => {
    socket?.on('chat:read_ack', cb);
  },

  onTyping: (cb: (data: any) => void) => {
    socket?.on('chat:typing', cb);
  },

  onStopTyping: (cb: (data: any) => void) => {
    socket?.on('chat:stop_typing', cb);
  },

  onUserOnline: (cb: (data: { userId: string }) => void) => {
    socket?.on('user:online', cb);
  },

  onUserOffline: (cb: (data: { userId: string }) => void) => {
    socket?.on('user:offline', cb);
  },

  off: (event: string) => {
    socket?.off(event);
  },

  getSocket: () => socket,
};