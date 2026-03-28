export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "blocked";
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
}

export interface StatusCountDTO {
  status: string;
  count: number;
}

export interface MonthlyRevenueDTO {
  month: string;
  revenue: number;
}

export interface AdminDashboardStats {
  users: StatusCountDTO[];
  owners: StatusCountDTO[];
  properties: StatusCountDTO[];
  bookings: StatusCountDTO[];
  totalRevenue: number;                 
  monthlyRevenue: MonthlyRevenueDTO[];
}



export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "blocked";
  isVerified: boolean;
  profileImage?: { url: string; publicId: string };
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponseDto {
  users: UserListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  message: string;
  status: number;
}

export interface UserDetailResponseDto {
  user: UserListItem & {
    address?: {
      houseNo: string;
      street: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    };
    googleId?: string;
  };
  message: string;
  status: number;
}

export interface OwnerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  businessAddress: string;
  businessName: string;
  document?: string;
  status: "active" | "blocked";
  isVerified: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface OwnersListResponseDto {
  owners: OwnerListItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  message: string;
  status: number;
}

export interface OwnerDetailResponseDto {
  owner: OwnerListItem & {
    // if owner has extra fields like documents or other details
    document?: string;
    businessAddress: string;
    businessName: string;
    approvalStatus: "pending" | "approved" | "rejected";
  };
  message: string;
  status: number;
}