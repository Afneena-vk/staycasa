import { IUser } from "../models/userModel";
import { UserLoginResponseDto, UserGoogleAuthResponseDto, UserProfileResponseDto } from "../dtos/user.dto";

export class UserMapper {
  
    static toLoginResponse(user: IUser, accessToken: string, refreshToken: string,  message: string): UserLoginResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
    //status: user.status,
      userStatus: user.status,
      isVerified: user.isVerified,
      //token,
      token: accessToken,
      refreshToken: refreshToken,
      message,
      status: 200,
    };
  }

  static toGoogleAuthResponse(user: IUser,  accessToken: string, refreshToken: string, message: string): UserGoogleAuthResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      userStatus: user.status,
      status: user.status,
      isVerified: user.isVerified,
      token: accessToken,
      refreshToken: refreshToken,
      message,
    };
  }


 static toProfileResponse(
    user: IUser, 
    message: string
  ): UserProfileResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      address: user.address
        ? {
            houseNo: user.address.houseNo,
            street: user.address.street,
            city: user.address.city,
            district: user.address.district,
            state: user.address.state,
            pincode: user.address.pincode,
          }
        : undefined,
      userStatus: user.status,
      isVerified: user.isVerified,
      message,
      //responseStatus: 200,
      status: 200,
    };
  }
}

