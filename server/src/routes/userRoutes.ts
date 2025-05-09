import { Router } from "express";
import userController from "../controllers/userController";
const userRoutes = Router();
// userRoutes.post("/signup",(req,res)=>{
//     console.log(req.body);
// })
userRoutes.post("/signup", userController.signup);
userRoutes.post("/verify-otp", userController.verifyOtp);
export default userRoutes