
import { ITokenBlacklist } from "../../models/tokenBlacklistModel";

export interface ITokenBlacklistRepository {
  addToken(token: string, type: 'access' | 'refresh', userId: string, userType: string, expiresAt: Date): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
  removeExpiredTokens(): Promise<void>;
}