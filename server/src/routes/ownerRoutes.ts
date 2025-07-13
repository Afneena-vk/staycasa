import { Router } from "express";
import ownerController from "../controllers/ownerController";
//import passport from "passport";

const ownerRoutes = Router();


ownerRoutes.post("/signup",ownerController.signup)
ownerRoutes.post("/verify-otp", ownerController.verifyOtp);
ownerRoutes.post("/resend-otp", ownerController.resendOtp);
ownerRoutes.post("/login", ownerController.login);

ownerRoutes.post("/forgot-password", ownerController.forgotPassword);
ownerRoutes.post("/reset-password", ownerController.resetPassword);


export default ownerRoutes
