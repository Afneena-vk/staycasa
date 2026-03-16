
export interface MessageResponseDTO {
  id: string;
  senderId: string;
  senderModel: 'User' | 'Owner';
  receiverId: string;
  receiverModel: 'User' | 'Owner';
  propertyId: string;
  content?: string;
  image?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ConversationListDTO {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string | null;
  otherUserId: string;
  otherUserName: string
  otherUserModel: 'User' | 'Owner';
  lastMessage: MessageResponseDTO;
  unreadCount: number;
}