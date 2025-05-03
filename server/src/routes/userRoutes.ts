import { Router } from "express";
const userRoutes = Router();
userRoutes.post("/signup",(req,res)=>{
    console.log(req.body);
})
export default userRoutes