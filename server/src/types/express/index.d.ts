declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userType?: "user" | "admin" | "owner";
    }
  }
}

export {};