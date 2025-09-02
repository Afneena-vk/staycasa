import { IOwner } from "../models/ownerModel";
import { OwnerLoginResponseDto, OwnerProfileResponseDto } from "../dtos/owner.dto";

export class OwnerMapper {
  static toLoginResponse(owner: IOwner, accessToken: string, refreshToken: string, message: string): OwnerLoginResponseDto {
    return {
      id: owner._id.toString(),
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      profileImage: owner.profileImage,
      businessName: owner.businessName,
      businessAddress: owner.businessAddress,
      // documents: owner.documents,
      document: owner.document,
      approvalStatus:owner.approvalStatus,
      isVerified: owner.isVerified,
      isBlocked: owner.isBlocked,
      token: accessToken,
      refreshToken: refreshToken,
      message,
      status: 200,
    };
  }
  static toProfileResponse(owner: IOwner, message: string): OwnerProfileResponseDto {
  return {
    id: owner._id.toString(),
    name: owner.name,
    email: owner.email,
    phone: owner.phone,
    //profileImage: owner.profileImage,
    businessName: owner.businessName,
    businessAddress: owner.businessAddress,
    approvalStatus: owner.approvalStatus,  
    document: owner.document, 
    message,
    status: 200,
  };
}
}
