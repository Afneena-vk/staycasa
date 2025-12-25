

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


 
  getCsrfToken(): string | null {
    return sessionStorage.getItem("csrf-token");
  }

  setCsrfToken(token: string): void {
    sessionStorage.setItem("csrf-token", token);
  }

  clearCsrfToken(): void {
    sessionStorage.removeItem("csrf-token");
  }

}

export const tokenService = new TokenService();