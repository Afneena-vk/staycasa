
import { Request, Response, NextFunction } from 'express';

export interface IMessageController {
  getConversation(req: Request, res: Response, next: NextFunction): Promise<void>;
  getConversationList(req: Request, res: Response, next: NextFunction): Promise<void>;
  markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}