export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  userStatus: "active" | "blocked";
  profileImage?: string;
  isVerified: boolean;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  userStatus: "active" | "blocked";
  isVerified: boolean;
  status: number;
  profileImage?: string;
  message: string;
  data: UserProfile;
}
