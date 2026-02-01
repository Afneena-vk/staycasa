import { injectable,inject } from 'tsyringe';
import {AdminLoginData, IAdminService} from './interfaces/IAdminService'
import { IAdminRepository } from '../repositories/interfaces/IAdminRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IOwnerRepository } from '../repositories/interfaces/IOwnerRepository';
import { IPropertyRepository } from '../repositories/interfaces/IPropertyRepository';
import { IBookingRepository } from '../repositories/interfaces/IBookingRepository';
import { INotificationService } from './interfaces/INotificationService';
import { TOKENS } from '../config/tokens';
import { UserStatistics } from './interfaces/IAdminService';
//import adminRepository from '../repositories/adminRepository'
import OTPService from '../utils/OTPService'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { AdminMapper } from '../mappers/adminMapper';
import { AdminLoginResponseDto, UsersListResponseDto, UserListQueryDto, UserDetailResponseDto, OwnerListQueryDto, OwnersListResponseDto, OwnerDetailResponseDto, UserStatisticsDto, AdminDashboardDTO } from '../dtos/admin.dto';


@injectable()
export class AdminService implements IAdminService {

   constructor(
    @inject(TOKENS.IAdminRepository) private _adminRepository: IAdminRepository,
    @inject(TOKENS.IUserRepository) private _userRepository: IUserRepository,
    @inject(TOKENS.IOwnerRepository) private _ownerRepository: IOwnerRepository,
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository,
    @inject(TOKENS.IBookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TOKENS.INotificationService) private _notificationService: INotificationService
  ) {}

    async loginAdmin(data: AdminLoginData): Promise<AdminLoginResponseDto> {
    

        const { email, password } = data;
    
        if (!email || !password) {
          const error: any = new Error(MESSAGES.ERROR.INVALID_INPUT);
          error.status = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
    
        const admin = await this._adminRepository.findByEmail(email);
    
        if (!admin) {
          const error: any = new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
          error.status = STATUS_CODES.UNAUTHORIZED;
          throw error;
        }
    
        const isPasswordValid = await bcrypt.compare(password, admin.password || "");
    
        if (!isPasswordValid) {
          const error: any = new Error("Invalid email or password");
          error.status = STATUS_CODES.UNAUTHORIZED;
          throw error;
        }
    
        const JWT_SECRET = process.env.JWT_SECRET;
          const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    
       
         if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    
       
    
    const accessToken = jwt.sign(
      { userId: admin._id, email: admin.email, type: "admin" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: admin._id, email: admin.email, type: "admin" },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

        
        return AdminMapper.toLoginResponse(admin, accessToken, refreshToken, MESSAGES.SUCCESS.LOGIN);
      }

      

      async getUsersList(queryParams: UserListQueryDto): Promise<UsersListResponseDto> {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                status = 'all',
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = queryParams;

          
            const validatedPage = Math.max(1, page);
            const validatedLimit = Math.min(Math.max(1, limit), 100); 

            const result = await this._adminRepository.findUsersWithPagination({
                page: validatedPage,
                limit: validatedLimit,
                search,
                status,
                sortBy,
                sortOrder
            });

            return AdminMapper.toUsersListResponse(
                result.users,
                result.totalCount,
                validatedPage,
                validatedLimit,
                "Users retrieved successfully"
            );

        } catch (error: any) {
            const customError: any = new Error("Failed to retrieve users list");
            customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            throw customError;
        }
    }

async blockUser(userId: string): Promise<{ message: string; status: number }> {
    try {
        
        const user = await this._adminRepository.findUserById(userId);
        
        if (!user) {
            const error: any = new Error("User not found");
            error.status = STATUS_CODES.NOT_FOUND;
            throw error;
        }

        if (user.status === 'blocked') {
            const error: any = new Error("User is already blocked");
            error.status = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        
        await this._adminRepository.updateUserStatus(userId, 'blocked');

        return {
            message: "User blocked successfully",
            status: STATUS_CODES.OK
        };

    } catch (error: any) {
        if (error.status) {
            throw error;
        }
        const customError: any = new Error("Failed to block user");
        customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        throw customError;
    }
}

async unblockUser(userId: string): Promise<{ message: string; status: number }> {
    try {
        
        const user = await this._adminRepository.findUserById(userId);
        
        if (!user) {
            const error: any = new Error("User not found");
            error.status = STATUS_CODES.NOT_FOUND;
            throw error;
        }

        if (user.status === 'active') {
            const error: any = new Error("User is already active");
            error.status = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        
        await this._adminRepository.updateUserStatus(userId, 'active');

        return {
            message: "User unblocked successfully",
            status: STATUS_CODES.OK
        };

    } catch (error: any) {
        if (error.status) {
            throw error;
        }
        const customError: any = new Error("Failed to unblock user");
        customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
        throw customError;
    }
}

async getUserById(userId: string): Promise<UserDetailResponseDto> {
  try {
    
    if (!userId || userId.length !== 24) {
      const error: any = new Error("Invalid user ID format");
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const user = await this._adminRepository.findUserById(userId);
    
    if (!user) {
      const error: any = new Error("User not found");
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    return AdminMapper.toUserDetailResponse(user, "User details retrieved successfully");

  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    const customError: any = new Error("Failed to retrieve user details");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}


async getOwnersList(queryParams: OwnerListQueryDto): Promise<OwnersListResponseDto> {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100);

    const result = await this._adminRepository.findOwnersWithPagination({
      page: validatedPage,
      limit: validatedLimit,
      search,
      status,
      sortBy,
      sortOrder
    });

    return AdminMapper.toOwnersListResponse(
      result.owners,
      result.totalCount,
      validatedPage,
      validatedLimit,
      "Owners retrieved successfully"
    );
  } catch (error) {
    const customError: any = new Error("Failed to retrieve owners list");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}

async blockOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
   
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      const error: any = new Error("Owner not found");
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (owner.isBlocked) {
      const error: any = new Error("Owner is already blocked");
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    
    await this._adminRepository.updateOwnerStatus(ownerId, 'blocked');

    return {
      message: "Owner blocked successfully",
      status: STATUS_CODES.OK
    };

  } catch (error: any) {
    if (error.status) throw error;
    const customError: any = new Error("Failed to block owner");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}

async unblockOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
    
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      const error: any = new Error("Owner not found");
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (!owner.isBlocked) {
      const error: any = new Error("Owner is already active");
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

  
    await this._adminRepository.updateOwnerStatus(ownerId, 'active');

    return {
      message: "Owner unblocked successfully",
      status: STATUS_CODES.OK
    };

  } catch (error: any) {
    if (error.status) throw error;
    const customError: any = new Error("Failed to unblock owner");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}

async getOwnerById(ownerId: string): Promise<OwnerDetailResponseDto> {
  try {
    
    if (!ownerId || ownerId.length !== 24) {
      const error: any = new Error("Invalid owner ID format");
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      const error: any = new Error("Owner not found");
      error.status = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    return AdminMapper.toOwnerDetailResponse(
      owner,
      "Owner details retrieved successfully"
    );

  } catch (error: any) {
    if (error.status) throw error;
    const customError: any = new Error("Failed to retrieve owner details");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}


async approveOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      return { message: MESSAGES.ERROR.VENDOR_NOT_FOUND, status: STATUS_CODES.NOT_FOUND };
    }

    
    if (!owner.document) {
      return { message: MESSAGES.ERROR.NO_DOCUMENTS, status: STATUS_CODES.BAD_REQUEST };
    }

   
    if (owner.approvalStatus === "approved") {
      return { message: "Owner is already approved.", status: STATUS_CODES.BAD_REQUEST };
    }

   
    if (owner.approvalStatus === "pending" || owner.approvalStatus === "rejected") {
      await this._adminRepository.updateOwnerApprovalStatus(ownerId, "approved");
      await this._notificationService.createNotification(
        owner._id.toString(),       
        "Owner",
        "approval",
        "Account Approved",
        `Congratulations ${owner.name}, your account has been approved by the admin.`,
        owner._id.toString()
      );

      return { message: "Owner approved successfully", status: STATUS_CODES.OK };
    }



   
    return { message: "Invalid approval status", status: STATUS_CODES.BAD_REQUEST };
  } catch (error: any) {
    if (error.status) throw error;
    const customError: any = new Error("Failed to approve owner");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}
  

async rejectOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      return { message: MESSAGES.ERROR.VENDOR_NOT_FOUND, status: STATUS_CODES.NOT_FOUND };
    }

    
    if (!owner.document) {
      return { message: MESSAGES.ERROR.NO_DOCUMENTS, status: STATUS_CODES.BAD_REQUEST };
    }

    
    if (owner.approvalStatus === "rejected") {
      return { message: "Owner is already rejected.", status: STATUS_CODES.BAD_REQUEST };
    }

  
    if (owner.approvalStatus === "pending" || owner.approvalStatus === "approved") {
      await this._adminRepository.updateOwnerApprovalStatus(ownerId, "rejected");
     
      await this._notificationService.createNotification(
        owner._id.toString(),       
        "Owner",
        "approval",
        "Account Rejected",
        `Hi ${owner.name}, unfortunately your account verification was rejected by the admin. Please review your documents and upload valid documents to proceed.`,
        owner._id.toString()
      );
      
      return { message: "Owner rejected successfully", status: STATUS_CODES.OK };
    }

    await this._notificationService.createNotification(
          ownerId,     
          "Owner",                 
          "system",                 
          "Account Rejected",      
          "Your owner account has been rejected. Please check your documents and try again.", 
                       
        );
    
    return { message: "Invalid rejection status", status: STATUS_CODES.BAD_REQUEST };
  } catch (error: any) {
    if (error.status) throw error;
    const customError: any = new Error("Failed to reject owner");
    customError.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    throw customError;
  }
}

// async adminUserStatistics(): Promise<UserStatisticsDto> {
//   try {
//     //const { totalUsers, activeUsers, blockedUsers } = await this._userRepository.getUserStatistics();
//     // return { totalUsers, activeUsers, blockedUsers };
//     const stats = await this._userRepository.getUserStatistics();
    
//     return AdminMapper.toUserStatisticsDto(stats)
//   } catch (err) {
//     throw new Error("Failed to fetch user statistics");
//   }
// }


async getAdminDashboardStats(): Promise<AdminDashboardDTO>{
    const [
    userStats,
    ownerStats,
    propertyStats,
    bookingStats
  ] = await Promise.all([
    this._userRepository.getUserStatusCounts(),
    this._ownerRepository.getOwnerStatusCounts(),
    this._propertyRepository.getPropertyStatusCounts(),
    this._bookingRepository.getBookingStatusCounts()
  ]);
  
  return AdminMapper.toDashboardDTO(
    userStats,
    ownerStats,
    propertyStats,
    bookingStats
  );
}

      
 }


 

//export default new AdminService();