import { Router } from "express";
import userController from "../controllers/userController";
const userRoutes = Router();
// userRoutes.post("/signup",(req,res)=>{
//     console.log(req.body);
// })
userRoutes.post("/signup", userController.signup);
export default userRoutes