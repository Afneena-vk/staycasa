export class AdminLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  token!: string;
  refreshToken?: string;
  message!: string;
  status!: number; 
}

export class AdminBasicDetailsDto {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;
}
