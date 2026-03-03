
export interface MessageDTO {
  _id: string;
  sender: string;
  senderModel: 'User' | 'Owner';
  receiver: string;
  receiverModel: 'User' | 'Owner';
  propertyId: string;
  content?: string;
  image?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationListItem {
  propertyId: string;
  otherUserId: string;
  otherUserModel: 'User' | 'Owner';
  propertyTitle: string;
  propertyImage?: string;
  lastMessage: MessageDTO;
  unreadCount: number;
}