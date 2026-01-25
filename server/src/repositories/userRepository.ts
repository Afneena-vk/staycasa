
import { injectable } from 'tsyringe';
import User, { IUser } from '../models/userModel';
import { BaseRepository } from './baseRepository';
import { IUserRepository } from './interfaces/IUserRepository';
import { UserStatistics } from './interfaces/IUserRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }


  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId }).exec();
  }

async getUserStatistics(): Promise<UserStatistics>{
  const [total,active,blocked]= await Promise.all([
    User.countDocuments({}),
    User.countDocuments({status: "active" }),
    User.countDocuments({status: "blocked" }),
  ]);
    return {
    totalUsers: total,
    activeUsers: active,
    blockedUsers: blocked,
  };
}

  async getUserStatusCounts(): Promise<{ _id: string; count: number }[]> {
    return await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }

}

//export default new UserRepository();


