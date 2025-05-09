import { Router } from "express";
import ownerController from "../controllers/ownerController";
const ownerRoutes = Router();
// ownerRoutes.post("/signup",(req,res)=>{
//     console.log(req.body);
// })

ownerRoutes.post("/signup",ownerController.signup)
ownerRoutes.post("/verify-otp", ownerController.verifyOtp);
ownerRoutes.post("/login", ownerController.login);
export default ownerRoutes