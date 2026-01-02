import { IAdmin } from "../models/adminModel";
import { IUser } from "../models/userModel";
import { IOwner } from "../models/ownerModel";
import { AdminLoginResponseDto, AdminBasicDetailsDto ,UserListItemDto, 
  UsersListResponseDto, UserDetailDto, UserDetailResponseDto, OwnersListResponseDto,OwnerListItemDto, OwnerDetailDto, OwnerDetailResponseDto, UserStatisticsDto } from "../dtos/admin.dto";


export class AdminMapper {
  static toLoginResponse(admin: IAdmin, accessToken: string, refreshToken: string, message: string): AdminLoginResponseDto {
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      token: accessToken,
      refreshToken: refreshToken,
      message,
      status: 200,
    };
  }

  static toBasicDetails(admin: IAdmin): AdminBasicDetailsDto {
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }

static toUserListItem(user: IUser): UserListItemDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || undefined,
      status: user.status,
      isVerified: user.isVerified,
      profileImage: user.profileImage || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
 
  static toUsersListResponse(
    users: IUser[], 
    totalCount: number, 
    currentPage: number, 
    limit: number, 
    message: string
  ): UsersListResponseDto {
    const userDtos = users.map(user => this.toUserListItem(user));
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users: userDtos,
      totalCount,
      currentPage,
      totalPages,
      message,
      status: 200,
    };
  }

  static toUserDetail(user: IUser): UserDetailDto {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || undefined,
    status: user.status,
    isVerified: user.isVerified,
    profileImage: user.profileImage || undefined,
    address: user.address ? {
      houseNo: user.address.houseNo,
      street: user.address.street,
      city: user.address.city,
      district: user.address.district,
      state: user.address.state,
      pincode: user.address.pincode,
    } : undefined,
    googleId: user.googleId || undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

static toUserDetailResponse(user: IUser, message: string): UserDetailResponseDto {
  return {
    user: this.toUserDetail(user),
    message,
    status: 200,
  };
}

static toOwnerListItem(owner: IOwner): OwnerListItemDto {
  return {
    id: owner._id.toString(),
    name: owner.name,
    email: owner.email,
    phone: owner.phone,
    profileImage: owner.profileImage || undefined,
    businessAddress: owner.businessAddress,
    businessName: owner.businessName,
    document: owner.document,
    status: owner.isBlocked ? 'blocked' : 'active',
    isVerified: owner.isVerified,
    createdAt: owner.createdAt,
    updatedAt: owner.updatedAt,
    approvalStatus: owner.approvalStatus,
  };
}

static toOwnersListResponse(
  owners: IOwner[],
  totalCount: number,
  currentPage: number,
  limit: number,
  message: string
): OwnersListResponseDto {
  const ownerDtos = owners.map(owner => this.toOwnerListItem(owner));
  const totalPages = Math.ceil(totalCount / limit);

  return {
    owners: ownerDtos,
    totalCount,
    currentPage,
    totalPages,
    message,
    status: 200,
  };
}

static toOwnerDetail(owner: IOwner): OwnerDetailDto {
    return {
      id: owner._id.toString(),
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      profileImage: owner.profileImage || undefined,
      businessAddress: owner.businessAddress,
      businessName: owner.businessName,
      document: owner.document,
      status: owner.isBlocked ? 'blocked' : 'active',
      isVerified: owner.isVerified,
      approvalStatus: owner.approvalStatus,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
    };
  }

  static toOwnerDetailResponse(owner: IOwner, message: string): OwnerDetailResponseDto {
    return {
      owner: this.toOwnerDetail(owner),
      message,
      status: 200,
    };
  }

static toUserStatisticsDto(stats:{
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number; 
}):UserStatisticsDto {
    return {
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      blockedUsers: stats.blockedUsers,
    };
  }

}
