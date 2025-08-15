

import { IBaseRepository } from './IBaseRepository';
import { IUser } from '../../models/userModel';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
          
}
