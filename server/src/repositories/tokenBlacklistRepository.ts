import { injectable } from 'tsyringe';
import TokenBlacklist, { ITokenBlacklist } from '../models/tokenBlacklistModel';
import { ITokenBlacklistRepository } from './interfaces/ITokenBlacklistRepository';


@injectable()
export class TokenBlacklistRepository  implements ITokenBlacklistRepository {
  async addToken(token: string, type: 'access' | 'refresh', userId: string, userType: 'user' | 'owner' | 'admin', expiresAt: Date): Promise<void> {
    await TokenBlacklist.create({ token, type, userId, userType, expiresAt });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await TokenBlacklist.findOne({ token }).exec();
    return !!blacklistedToken;
  }

  async removeExpiredTokens(): Promise<void> {
    await TokenBlacklist.deleteMany({ expiresAt: { $lt: new Date() } });
  }
}