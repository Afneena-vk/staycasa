import { IUser } from "../models/userModel";
import { UserLoginResponseDto, UserGoogleAuthResponseDto } from "../dtos/user.dto";

export class UserMapper {
  // static toLoginResponse(user: IUser, token: string, message: string): UserLoginResponseDto {
    static toLoginResponse(user: IUser, accessToken: string, refreshToken: string,  message: string): UserLoginResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    //   status: user.status,
    userStatus: user.status,
      isVerified: user.isVerified,
      //token,
       token: accessToken,
      refreshToken: refreshToken,
      message,
       status: 200,
    };
  }

  static toGoogleAuthResponse(user: IUser, token: string, message: string): UserGoogleAuthResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
       userStatus: user.status,
      status: user.status,
      isVerified: user.isVerified,
      token,
      message,
    };
  }
}
