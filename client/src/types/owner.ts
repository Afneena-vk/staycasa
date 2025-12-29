
export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  approvalStatus: "pending" | "approved" | "rejected";
  documents: string[];
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  approvalStatus: "pending" | "approved" | "rejected";
  documents: string[];
  status: number;
  message?: string;
  data: OwnerProfile;
}