import { Router } from "express";
import ownerController from "../controllers/ownerController";
//import passport from "passport";

const ownerRoutes = Router();
// ownerRoutes.post("/signup",(req,res)=>{
//     console.log(req.body);
// })

ownerRoutes.post("/signup",ownerController.signup)
ownerRoutes.post("/verify-otp", ownerController.verifyOtp);
ownerRoutes.post("/resend-otp", ownerController.resendOtp);
ownerRoutes.post("/login", ownerController.login);
export default ownerRoutes
