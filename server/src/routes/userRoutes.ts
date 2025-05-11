import { Router } from "express";
import userController from "../controllers/userController";
import passport from "passport";

const userRoutes = Router();

// userRoutes.post("/signup",(req,res)=>{
//     console.log(req.body);
// })
userRoutes.post("/signup", userController.signup);
userRoutes.post("/verify-otp", userController.verifyOtp);
userRoutes.post("/login", userController.login);


userRoutes.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  userRoutes.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    userController.googleCallback
  );

export default userRoutes
