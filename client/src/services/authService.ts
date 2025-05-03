import { ownerApi, userApi } from "../api/api";
export const authService = {
userSignup: async (userData: any) => {
    const response = await userApi.post("/signup", userData);
    return response.data;
  },
  ownerSignup: async (userData: any) => {
    const response = await ownerApi.post("/signup", userData);
    return response.data;
  },
}

