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

export class UserProfileUpdateDto {
  name?: string;
  phone?: string;
  //profileImage?: string;
  address?: {
    houseNo?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
}

export class UserProfileResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  //profileImage?: string;
  address?: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  userStatus!: "active" | "blocked";
  isVerified!: boolean;
  message!: string;
  //responseStatus!: number; // differentiate from userStatus
  status!:number
}
