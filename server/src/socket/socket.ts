
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { container } from '../config/container';
import { TOKENS } from '../config/tokens';
import { IMessageService } from '../services/interfaces/IMessageService';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userType?: 'user' | 'owner';
}

let io: SocketIOServer;


const onlineUsers = new Map<string, string>();

export const initSocket = (server: HttpServer): void => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split('; ')
          .find((c) => c.startsWith('access-token='))
          ?.split('=')[1];

      if (!token) return next(new Error('Unauthorized'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        type: 'user' | 'owner' | 'admin';
      };

      socket.userId = decoded.userId;
      socket.userType = decoded.type as 'user' | 'owner';
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    
      console.log(" User connected:", socket.id);
  console.log(" User ID:", socket.userId);
  console.log(" User Type:", socket.userType);

    const userId = socket.userId!;
    onlineUsers.set(userId, socket.id);

    
    socket.broadcast.emit('user:online', { userId });

    
    socket.on('chat:join', ({ otherUserId, propertyId }: { otherUserId: string; propertyId: string }) => {  
        console.log(" JOIN ROOM EVENT");
  console.log("Sender:", userId);
  console.log("Other:", otherUserId);
  console.log("Property:", propertyId);
      const roomId = getRoomId(userId, otherUserId, propertyId);
      socket.join(roomId);
    });

    socket.on(
      'chat:send',
      async ({
        receiverId,
        receiverModel,
        propertyId,
        content,
        image,
      }: {
        receiverId: string;
        receiverModel: 'User' | 'Owner';
        propertyId: string;
        content?: string;
        image?: string;
      }) => {
        try {
          const messageService = container.resolve<IMessageService>(TOKENS.IMessageService);
          const senderModel = socket.userType === 'owner' ? 'Owner' : 'User';

          const savedMessage = await messageService.saveMessage({
            sender: userId,
            senderModel,
            receiver: receiverId,
            receiverModel,
            propertyId,
            content,
            image,
          });

          const roomId = getRoomId(userId, receiverId, propertyId);

          
          io.to(roomId).emit('chat:receive', savedMessage);

          
          const receiverSocketId = onlineUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('chat:notification', {
              senderId: userId,
              senderModel,
              propertyId,
              content: content || '📷 Image',
              createdAt: savedMessage.createdAt,
            });
          }
        } catch (error) {
          socket.emit('chat:error', { message: 'Failed to send message' });
        }
      }
    );

    
    socket.on('chat:read', async ({ senderId, propertyId }: { senderId: string; propertyId: string }) => {
      try {
        const messageService = container.resolve<IMessageService>(TOKENS.IMessageService);
        await messageService.markAsRead(userId, senderId, propertyId);

        
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('chat:read_ack', { by: userId, propertyId });
        }
      } catch (error) {
        socket.emit('chat:error', { message: 'Failed to mark as read' });
      }
    });

    
    socket.on('chat:typing', ({ receiverId, propertyId }: { receiverId: string; propertyId: string }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('chat:typing', { senderId: userId, propertyId });
      }
    });

    socket.on('chat:stop_typing', ({ receiverId, propertyId }: { receiverId: string; propertyId: string }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('chat:stop_typing', { senderId: userId, propertyId });
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit('user:offline', { userId });
    });
  });
};


const getRoomId = (id1: string, id2: string, propertyId: string): string => {
  const sorted = [id1, id2].sort();
  return `chat:${sorted[0]}:${sorted[1]}:${propertyId}`;
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};