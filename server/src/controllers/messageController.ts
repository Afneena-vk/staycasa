
import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { IMessageController } from './interfaces/IMessageController';
import { IMessageService } from '../services/interfaces/IMessageService';
import { TOKENS } from '../config/tokens';
import { STATUS_CODES, MESSAGES } from '../utils/constants';
import { AppError } from '../utils/AppError';

@injectable()
export class MessageController implements IMessageController {
  constructor(
    @inject(TOKENS.IMessageService) private _messageService: IMessageService
  ) {}

  async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ownerId, propertyId } = req.params;
      

       const userId = req.userId;
       const userType = req.userType;

        if (!userId) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        if (!userType) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

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
 

       const userId = req.userId;
       const userType = req.userType;

        if (!userId) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        if (!userType) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

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
     
       const receiverId = req.userId;

        if (!receiverId) {
           throw new AppError(MESSAGES.ERROR.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

      await this._messageService.markAsRead(receiverId, senderId, propertyId);
      res.status(STATUS_CODES.OK).json({ success: true, message: "Messages marked as read",});
    } catch (error) {
      next(error);
    }
  }
}