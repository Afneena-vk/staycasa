type AuthType = "user" | "owner" | "admin";

//export const tokenService = {
  class TokenService {
      private getKey(key: "accessToken" | "refreshToken", authType: AuthType) {
    return `${authType}-${key}`;
  }

    getAccessToken(authType: AuthType): string | null {
    return localStorage.getItem(this.getKey("accessToken", authType));
  }

  getRefreshToken(authType: AuthType): string | null {
    return localStorage.getItem(this.getKey("refreshToken", authType));
  }

  setAccessToken(token: string, authType: AuthType): void {
    localStorage.setItem(this.getKey("accessToken", authType), token);
  }

  setRefreshToken(token: string, authType: AuthType): void {
    localStorage.setItem(this.getKey("refreshToken", authType), token);
  }

  clearTokens(authType: AuthType): void {
    localStorage.removeItem(this.getKey("accessToken", authType));
    localStorage.removeItem(this.getKey("refreshToken", authType));
  }
  // getAccessToken: () => localStorage.getItem("accessToken"),
  // getRefreshToken: () => localStorage.getItem("refreshToken"),

  // setAccessToken: (token: string) => localStorage.setItem("accessToken", token),
  // setRefreshToken: (token: string) => localStorage.setItem("refreshToken", token),

  // clearTokens: () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  // },

  clearAllTokens(): void {
  const authTypes: AuthType[] = ["user", "owner", "admin"];
  authTypes.forEach(authType => {
    this.clearTokens(authType);
  });
}


};

export const tokenService = new TokenService();