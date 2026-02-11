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

