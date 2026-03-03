
import { injectable } from 'tsyringe';
import Message, { IMessage } from '../models/messageModel';
import { BaseRepository } from './baseRepository';
import { IMessageRepository } from './interfaces/IMessageRepository';
import mongoose from 'mongoose';
import { ConversationListDTO } from '../dtos/message.dto';

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor() {
    super(Message);
  }

  async getConversation(userId: string, ownerId: string, propertyId: string): Promise<IMessage[]> {
    return Message.find({
      propertyId: new mongoose.Types.ObjectId(propertyId),
      $or: [
        { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(ownerId) },
        { sender: new mongoose.Types.ObjectId(ownerId), receiver: new mongoose.Types.ObjectId(userId) },
      ],
    }).sort({ createdAt: 1 });
  }

  async markAsRead(receiverId: string, senderId: string, propertyId: string): Promise<void> {
    await Message.updateMany(
      {
        receiver: new mongoose.Types.ObjectId(receiverId),
        sender: new mongoose.Types.ObjectId(senderId),
        propertyId: new mongoose.Types.ObjectId(propertyId),
        isRead: false,
      },
      { $set: { isRead: true } }
    );
  }

  
  // async getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<any[]> {
    async getConversationList(userId: string, userModel: 'User' | 'Owner'): Promise<ConversationListDTO[]> {
    return Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            propertyId: '$propertyId',
            otherUser: {
              $cond: [
                { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                '$receiver',
                '$sender',
              ],
            },
            otherUserModel: {
              $cond: [
                { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                '$receiverModel',
                '$senderModel',
              ],
            },
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id.propertyId',
          foreignField: '_id',
          as: 'property',
        },
      },
      { $unwind: '$property' },
      {
        $project: {
          propertyId: '$_id.propertyId',
          otherUserId: '$_id.otherUser',
          otherUserModel: '$_id.otherUserModel',
          lastMessage: 1,
          unreadCount: 1,
          propertyTitle: '$property.title',
          propertyImage: { $arrayElemAt: ['$property.images', 0] },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);
  } 

async saveMessage(data: {
  sender: mongoose.Types.ObjectId;
  senderModel: 'User' | 'Owner';
  receiver: mongoose.Types.ObjectId;
  receiverModel: 'User' | 'Owner';
  propertyId: mongoose.Types.ObjectId;
  content?: string;
  image?: string;
}): Promise<IMessage> {

  const message = new Message({
    sender: data.sender,
    senderModel: data.senderModel,
    receiver: data.receiver,
    receiverModel: data.receiverModel,
    propertyId: data.propertyId,
    content: data.content,
    image: data.image,
    isRead: false,
  });

  return await message.save();
}
  
}