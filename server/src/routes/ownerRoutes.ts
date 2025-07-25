import { Router } from "express";
import ownerController from "../controllers/ownerController";
import { authMiddleware } from "../middleware/authMiddleware";

const ownerRoutes = Router();


ownerRoutes.post("/signup",ownerController.signup)
ownerRoutes.post("/verify-otp", ownerController.verifyOtp);
ownerRoutes.post("/resend-otp", ownerController.resendOtp);
ownerRoutes.post("/login", ownerController.login);

ownerRoutes.post("/forgot-password", ownerController.forgotPassword);
ownerRoutes.post("/reset-password", ownerController.resetPassword);


ownerRoutes.get(
  "/profile",
  authMiddleware(["owner"]),
  (req, res) => {
    res.json({
      ownerId: (req as any).userId,
      userType: (req as any).userType,
    });
  }
);

export default ownerRoutes
