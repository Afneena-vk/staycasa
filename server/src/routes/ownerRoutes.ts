import { Router } from "express";
const ownerRoutes = Router();
ownerRoutes.post("/signup",(req,res)=>{
    console.log(req.body);
})

export default ownerRoutes