// src/repositories/userRepository.ts

import User, { IUser } from '../models/userModel';
import { BaseRepository } from './baseRepository';
import { IUserRepository } from './interfaces/IUserRepository';

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId }).exec();
  }
}

export default new UserRepository();
