import { IOwner } from "../models/ownerModel";
import { OwnerLoginResponseDto } from "../dtos/owner.dto";

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
      documents: owner.documents,
      isVerified: owner.isVerified,
      isBlocked: owner.isBlocked,
      token: accessToken,
      refreshToken: refreshToken,
      message,
      status: 200,
    };
  }
}
