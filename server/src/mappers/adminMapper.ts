import { IAdmin } from "../models/adminModel";
import { AdminLoginResponseDto, AdminBasicDetailsDto } from "../dtos/admin.dto";

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
}
