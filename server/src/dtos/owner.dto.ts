export class OwnerLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  profileImage?: string;
  businessName!: string;
  status!: number;
  businessAddress!: string;
  documents: string[] = [];
  isVerified!: boolean;
  isBlocked!: boolean;
  token!: string;
  refreshToken!: string;
  message!: string;
}
