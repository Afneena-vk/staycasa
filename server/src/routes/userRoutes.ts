import { Router } from "express";
import userController from "../controllers/userController";
import passport from "passport";
import { authMiddleware } from "../middleware/authMiddleware";
const userRoutes = Router();


userRoutes.post("/signup", userController.signup);
userRoutes.post("/verify-otp", userController.verifyOtp);
userRoutes.post("/resend-otp",userController.resendOtp)
userRoutes.post("/login", userController.login);

userRoutes.post("/forgot-password", userController.forgotPassword);
userRoutes.post("/reset-password", userController.resetPassword);




userRoutes.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account", })
  );
  
  userRoutes.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    userController.googleCallback
  );






userRoutes.get(
  "/profile",
  authMiddleware(["user"]),
  (req, res) => {
    res.json({
      userId: (req as any).userId,
      userType: (req as any).userType,
    });
  }
);


export default userRoutes
