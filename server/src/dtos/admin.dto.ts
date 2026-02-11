export class AdminLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  token!: string;
  refreshToken?: string;
  message!: string;
  status!: number; 
}

export class AdminBasicDetailsDto {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;
}




export class UserListItemDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  status!: 'active' | 'blocked';
  isVerified!: boolean;
  // profileImage?: string;
  profileImage?: { url: string; publicId: string };

  createdAt!: Date;
  updatedAt!: Date;
}

export class UsersListResponseDto {
  users!: UserListItemDto[];
  totalCount!: number;
  currentPage!: number;
  totalPages!: number;
  message!: string;
  status!: number;
}

export class UserListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'blocked' | 'all';
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class UserDetailDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  status!: 'active' | 'blocked';
  isVerified!: boolean;
  // profileImage?: string;
  profileImage?: { url: string; publicId: string };

  address?: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  googleId?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class UserDetailResponseDto {
  user!: UserDetailDto;
  message!: string;
  status!: number;
}

export class OwnerListItemDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  profileImage?: string;
  businessAddress!: string;
  businessName!: string;
  // documents!: string[];
  document?: string;  
  status!: 'active' | 'blocked'; 
  isVerified!: boolean;
  approvalStatus!: 'pending' | 'approved' | 'rejected'; 
  createdAt!: Date;
  updatedAt!: Date;
}

export class OwnersListResponseDto {
  owners!: OwnerListItemDto[];
  totalCount!: number;
  currentPage!: number;
  totalPages!: number;
  message!: string;
  status!: number;
}

export class OwnerListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'blocked' | 'all';
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class OwnerDetailDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  profileImage?: string;
  businessAddress!: string;
  businessName!: string;
  // documents!: string[]; 
  document?: string;  
  status!: 'active' | 'blocked'; 
  isVerified!: boolean;
  approvalStatus!: 'pending' | 'approved' | 'rejected'; 
  createdAt!: Date;
  updatedAt!: Date;
}

export class OwnerDetailResponseDto {
  owner!: OwnerDetailDto;
  message!: string;
  status!: number;
}

export class UserStatisticsDto {
  totalUsers!: number;
  activeUsers!: number;
  blockedUsers!: number;
}

export interface StatusCountDTO {
  status: string;
  count: number;
}

export interface MonthlyRevenueDTO {
  month: string;
  revenue: number;
}

export interface AdminDashboardDTO {
  users: StatusCountDTO[];
  owners: StatusCountDTO[];
  properties: StatusCountDTO[];
  bookings: StatusCountDTO[];
  totalRevenue: number;                 
  monthlyRevenue: MonthlyRevenueDTO[]; 
}



