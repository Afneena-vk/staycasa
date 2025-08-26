
import { injectable } from 'tsyringe';
import Admin, { IAdmin } from '../models/adminModel';
import User, {IUser} from '../models/userModel';
import { BaseRepository } from './baseRepository';
import Owner, {IOwner} from '../models/ownerModel';
import { IAdminRepository, UserListQuery, UserListResult, OwnerListQuery, OwnerListResult} from './interfaces/IAdminRepository';


@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }

 async findUsersWithPagination(query: UserListQuery): Promise<UserListResult> {
    const {
      page = 1,
      limit = 10,
      search,
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

  
    const filter: any = {};

    
    if (status !== 'all') {
      filter.status = status;
    }

   
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    
    const skip = (page - 1) * limit;

    
    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-password -otp') 
        .exec(),
      User.countDocuments(filter).exec()
    ]);

    return {
      users,
      totalCount
    };
  }

  async findOwnersWithPagination(query: OwnerListQuery): Promise<OwnerListResult> {
  const {
    page = 1,
    limit = 10,
    search,
    status = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = query;

  const filter: any = {};
  if (status !== 'all') {
    filter.isBlocked = status === 'blocked';
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;

  const [owners, totalCount] = await Promise.all([
    Owner.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password -otp')
      .exec(),
    Owner.countDocuments(filter).exec()
  ]);

  return {
    owners,
    totalCount
  };
}

  async updateUserStatus(userId: string, status: 'active' | 'blocked'): Promise<IUser | null> {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true, runValidators: true }
        ).select('-password -otp').exec();
        
        return updatedUser;
    } catch (error) {
        throw new Error(`Failed to update user status: ${error}`);
    }
}

async findUserById(userId: string): Promise<IUser | null> {
    try {
        return await User.findById(userId).select('-password -otp').exec();
    } catch (error) {
        throw new Error(`Failed to find user: ${error}`);
    }
}

 async updateOwnerStatus(ownerId: string, status: 'active' | 'blocked'): Promise<IOwner | null> {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        { isBlocked: status === 'blocked' },
        { new: true, runValidators: true }
      )
        .select('-password -otp')
        .exec();

      return updatedOwner;
    } catch (error) {
      throw new Error(`Failed to update owner status: ${error}`);
    }
  }

   async findOwnerById(ownerId: string): Promise<IOwner | null> {
    try {
      return await Owner.findById(ownerId).select('-password -otp').exec();
    } catch (error) {
      throw new Error(`Failed to find owner: ${error}`);
    }
  }
async updateOwnerApprovalStatus(
  ownerId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<IOwner | null> {
  try {
    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      { approvalStatus: status },
      { new: true, runValidators: true }
    )
      .select('-password -otp')
      .exec();

    return updatedOwner;
  } catch (error) {
    throw new Error(`Failed to update owner approval status: ${error}`);
  }
}


}

//export default new AdminRepository();
