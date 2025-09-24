import { OwnerStatus } from "../models/ownerModel";

export class OwnerLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  profileImage?: string;
  businessName!: string;
  status!: number;
  approvalStatus!: OwnerStatus;
  businessAddress!: string;
  // documents: string[] = [];
  document?: string;
  isVerified!: boolean;
  isBlocked!: boolean;
  token!: string;
  refreshToken!: string;
  message!: string;
}

export class OwnerProfileUpdateDto {
  name?: string;
  phone?: string;
  businessName?: string;
  businessAddress?: string;
  //profileImage?: string;
}

export class OwnerProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  //profileImage?: string;
  businessName!: string;
  businessAddress!: string;
  approvalStatus!: OwnerStatus;  
  // documents!: string[];  
  document?: string;  
  message!: string;
  status!: number;
}