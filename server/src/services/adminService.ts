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
import { ISubscriptionService } from './interfaces/ISubscriptionService';
import { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository';
import { AppError } from '../utils/AppError';

@injectable()
export class AdminService implements IAdminService {

   constructor(
    @inject(TOKENS.IAdminRepository) private _adminRepository: IAdminRepository,
    @inject(TOKENS.IUserRepository) private _userRepository: IUserRepository,
    @inject(TOKENS.IOwnerRepository) private _ownerRepository: IOwnerRepository,
    @inject(TOKENS.IPropertyRepository) private _propertyRepository: IPropertyRepository,
    @inject(TOKENS.IBookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TOKENS.INotificationService) private _notificationService: INotificationService,
    @inject(TOKENS.ISubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository
  ) {}



      

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


      }   catch (error: unknown) {
          throw new AppError("Failed to retrieve users list", STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }

async blockUser(userId: string): Promise<{ message: string; status: number }> {
    try {
        
        const user = await this._adminRepository.findUserById(userId);
        
        if (!user) {

              throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
        }

        if (user.status === 'blocked') {

              throw new AppError("User is already blocked", STATUS_CODES.BAD_REQUEST);
        }

        
        await this._adminRepository.updateUserStatus(userId, 'blocked');

        return {
            message: "User blocked successfully",
            status: STATUS_CODES.OK
        };


    } catch (error: unknown) {
  if (error instanceof AppError) throw error;
  throw new AppError("Failed to block user", STATUS_CODES.INTERNAL_SERVER_ERROR);
}
}

async unblockUser(userId: string): Promise<{ message: string; status: number }> {
    try {
        
        const user = await this._adminRepository.findUserById(userId);
        
        if (!user) {

             throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
        }

        if (user.status === 'active') {

            throw new AppError("User is already active", STATUS_CODES.BAD_REQUEST);
        }

        
        await this._adminRepository.updateUserStatus(userId, 'active');

        return {
            message: "User unblocked successfully",
            status: STATUS_CODES.OK
        };


      }catch (error: unknown) {
  if (error instanceof AppError) throw error;

  throw new AppError("Some message", STATUS_CODES.INTERNAL_SERVER_ERROR);
}
}

async getUserById(userId: string): Promise<UserDetailResponseDto> {
  try {
    
    if (!userId || userId.length !== 24) {

       throw new AppError("Invalid user ID format", STATUS_CODES.BAD_REQUEST)
    }

    const user = await this._adminRepository.findUserById(userId);
    
    if (!user) {

      throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
    }

    return AdminMapper.toUserDetailResponse(user, "User details retrieved successfully");


  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to retrieve user details",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
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

   } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to retrieve owners list",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
}

async blockOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
   
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {

      throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);
    }

    if (owner.isBlocked) {

      throw new AppError("Owner is already blocked", STATUS_CODES.BAD_REQUEST);
    }

    
    await this._adminRepository.updateOwnerStatus(ownerId, 'blocked');

    return {
      message: "Owner blocked successfully",
      status: STATUS_CODES.OK
    };


    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to block owner",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
}

async unblockOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
    
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {

      throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);
    }

    if (!owner.isBlocked) {

      throw new AppError("Owner is already active", STATUS_CODES.BAD_REQUEST);
    }

  
    await this._adminRepository.updateOwnerStatus(ownerId, 'active');

    return {
      message: "Owner unblocked successfully",
      status: STATUS_CODES.OK
    };


    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to unblock owner",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
}

async getOwnerById(ownerId: string): Promise<OwnerDetailResponseDto> {
  try {
    
    if (!ownerId || ownerId.length !== 24) {

      throw new AppError("Invalid owner ID format", STATUS_CODES.BAD_REQUEST);
    }

    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {

      throw new AppError("Owner not found", STATUS_CODES.NOT_FOUND);
    }

    return AdminMapper.toOwnerDetailResponse(
      owner,
      "Owner details retrieved successfully"
    );


    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to retrieve owner details",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
}


async approveOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      
       throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    
    if (!owner.document) {
      //return { message: MESSAGES.ERROR.NO_DOCUMENTS, status: STATUS_CODES.BAD_REQUEST };
       throw new AppError(MESSAGES.ERROR.NO_DOCUMENTS, STATUS_CODES.BAD_REQUEST);
    }

   
    if (owner.approvalStatus === "approved") {
      //return { message: "Owner is already approved.", status: STATUS_CODES.BAD_REQUEST };
        throw new AppError("Owner is already approved.", STATUS_CODES.BAD_REQUEST);
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



   
    // return { message: "Invalid approval status", status: STATUS_CODES.BAD_REQUEST };
      throw new AppError("Invalid approval status", STATUS_CODES.BAD_REQUEST);

    } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to approve owner",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
}
  

async rejectOwner(ownerId: string): Promise<{ message: string; status: number }> {
  try {
    const owner = await this._adminRepository.findOwnerById(ownerId);

    if (!owner) {
      // return { message: MESSAGES.ERROR.VENDOR_NOT_FOUND, status: STATUS_CODES.NOT_FOUND };
       throw new AppError(MESSAGES.ERROR.VENDOR_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    
    if (!owner.document) {
      //return { message: MESSAGES.ERROR.NO_DOCUMENTS, status: STATUS_CODES.BAD_REQUEST };
     throw new AppError(MESSAGES.ERROR.NO_DOCUMENTS, STATUS_CODES.BAD_REQUEST);
    }

    
    if (owner.approvalStatus === "rejected") {
    //  return { message: "Owner is already rejected.", status: STATUS_CODES.BAD_REQUEST };
     throw new AppError( "Owner is already rejected.", STATUS_CODES.BAD_REQUEST);
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
    
    //return { message: "Invalid rejection status", status: STATUS_CODES.BAD_REQUEST };
       throw new AppError("Invalid rejection status", STATUS_CODES.BAD_REQUEST);

   } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Failed to reject owner",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
}

async getAdminDashboardStats(): Promise<AdminDashboardDTO>{
    const [
    userStats,
    ownerStats,
    propertyStats,
    bookingStats,
    totalRevenue,
    monthlyRevenue
  ] = await Promise.all([
    this._userRepository.getUserStatusCounts(),
    this._ownerRepository.getOwnerStatusCounts(),
    this._propertyRepository.getPropertyStatusCounts(),
    this._bookingRepository.getBookingStatusCounts(),
    this._subscriptionRepository.getTotalRevenue(),          
    this._subscriptionRepository.getMonthlyRevenue(new Date().getFullYear())
  ]);
  
  return AdminMapper.toDashboardDTO(
    userStats,
    ownerStats,
    propertyStats,
    bookingStats,
    totalRevenue,
    monthlyRevenue
  );
}



    async loginAdmin(data: AdminLoginData): Promise<AdminLoginResponseDto> {
    

        const { email, password } = data;
    
        if (!email || !password) {

          throw new AppError(MESSAGES.ERROR.INVALID_INPUT, STATUS_CODES.BAD_REQUEST);
        }
    
        const admin = await this._adminRepository.findByEmail(email);
    
        if (!admin) {

          throw new AppError(MESSAGES.ERROR.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
        }
    
        const isPasswordValid = await bcrypt.compare(password, admin.password || "");
    
        if (!isPasswordValid) {

          throw new AppError("Invalid email or password", STATUS_CODES.UNAUTHORIZED);
        }
    
        const JWT_SECRET = process.env.JWT_SECRET;
          const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    
       
         if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      // throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
      throw new AppError( MESSAGES.ERROR.JWT_SECRET_MISSING, STATUS_CODES.INTERNAL_SERVER_ERROR);
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

      
 }


 

//export default new AdminService();