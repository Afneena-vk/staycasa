import { AdminLoginResponseDto,UsersListResponseDto, UserListQueryDto, UserDetailResponseDto,OwnerListQueryDto,OwnersListResponseDto, OwnerDetailResponseDto } from "../../dtos/admin.dto";

export interface AdminLoginData {
    email: string;
    password: string;
  }

  // export interface IAdminService {
  //  loginAdmin(data: AdminLoginData): Promise<{
  //        token: string;
  //        admin: any;
  //        message: string;
  //        status: number;
  //      }>;
  // }
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
}


  export interface IAdminService {
      loginAdmin(data: AdminLoginData): Promise<AdminLoginResponseDto>;

      getUsersList(queryParams: UserListQueryDto): Promise<UsersListResponseDto>;
      blockUser(userId: string): Promise<{ message: string; status: number }>;
      unblockUser(userId: string): Promise<{ message: string; status: number }>;
      getUserById(userId: string): Promise<UserDetailResponseDto>;

      getOwnersList(queryParams: OwnerListQueryDto): Promise<OwnersListResponseDto>;
      blockOwner(ownerId: string): Promise<{ message: string; status: number }>;
      unblockOwner(ownerId: string): Promise<{ message: string; status: number }>;
      getOwnerById(ownerId: string): Promise<OwnerDetailResponseDto>;

      approveOwner(ownerId: string): Promise<{ message: string; status: number }>;
      rejectOwner(ownerId: string): Promise<{ message: string; status: number }>;

      adminUserStatistics(): Promise<UserStatistics>

    }
