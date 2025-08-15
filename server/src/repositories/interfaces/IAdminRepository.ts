

import { IBaseRepository } from './IBaseRepository';
import { IAdmin } from '../../models/adminModel';
import { IUser } from '../../models/userModel';
import { IOwner } from '../../models/ownerModel';

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'blocked' | 'all';
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResult {
  users: IUser[];
  totalCount: number;
}

export interface OwnerListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'blocked' | 'all';
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface OwnerListResult {
  owners: IOwner[];
  totalCount: number;
}

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;

  findUsersWithPagination(query: UserListQuery): Promise<UserListResult>;
  updateUserStatus(userId: string, status: 'active' | 'blocked'): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;

  findOwnersWithPagination(query: OwnerListQuery): Promise<OwnerListResult>;
  updateOwnerStatus(ownerId: string, status: 'active' | 'blocked'): Promise<IOwner | null>;
  findOwnerById(ownerId: string): Promise<IOwner | null>;
}
