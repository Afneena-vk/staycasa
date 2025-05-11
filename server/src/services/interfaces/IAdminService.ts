export interface AdminLoginData {
    email: string;
    password: string;
  }

  export interface IAdminService {
   loginAdmin(data: AdminLoginData): Promise<{
         token: string;
         admin: any;
         message: string;
         status: number;
       }>;
  }