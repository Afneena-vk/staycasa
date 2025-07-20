export class UserLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  userStatus!: string;
//status!: string;
  status!: number;
  isVerified!: boolean;
  token!: string;
  refreshToken!: string;
  message!: string;
}

export class UserGoogleAuthResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profileImage?: string;
  userStatus!: string;
  isVerified!: boolean;
  status!: string;
  token!: string;
  message!: string;
}
