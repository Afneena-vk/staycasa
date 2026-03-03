
import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { IMessageController } from './interfaces/IMessageController';
import { IMessageService } from '../services/interfaces/IMessageService';
import { TOKENS } from '../config/tokens';
import { STATUS_CODES } from '../utils/constants';

@injectable()
export class MessageController implements IMessageController {
  constructor(
    @inject(TOKENS.IMessageService) private _messageService: IMessageService
  ) {}

  async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ownerId, propertyId } = req.params;
      const userId = (req as any).userId;
      const userType = (req as any).userType;

      
      const resolvedUserId = userType === 'user' ? userId : ownerId;
      const resolvedOwnerId = userType === 'owner' ? userId : ownerId;

      const messages = await this._messageService.getConversation(resolvedUserId, resolvedOwnerId, propertyId);
      res.status(STATUS_CODES.OK).json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  }

  async getConversationList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const userType = (req as any).userType;
      const userModel = userType === 'owner' ? 'Owner' : 'User';

      const conversations = await this._messageService.getConversationList(userId, userModel);
      res.status(STATUS_CODES.OK).json({ success: true, conversations });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { senderId, propertyId } = req.body;
      const receiverId = (req as any).userId;

      await this._messageService.markAsRead(receiverId, senderId, propertyId);
      res.status(STATUS_CODES.OK).json({ success: true, message: "Messages marked as read",});
    } catch (error) {
      next(error);
    }
  }
}