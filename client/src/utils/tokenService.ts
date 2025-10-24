

type AuthType = "user" | "owner" | "admin";

class TokenService {
  
  getAuthType(): AuthType | null {
    return sessionStorage.getItem("auth-type") as AuthType | null;
  }

  setAuthType(authType: AuthType): void {
    sessionStorage.setItem("auth-type", authType);
  }

  clearAuthType(): void {
    sessionStorage.removeItem("auth-type");
  }


}

export const tokenService = new TokenService();