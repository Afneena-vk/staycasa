import { Router } from "express";
import userController from "../controllers/userController";
import passport from "passport";

const userRoutes = Router();

// userRoutes.post("/signup",(req,res)=>{
//     console.log(req.body);
// })
userRoutes.post("/signup", userController.signup);
userRoutes.post("/verify-otp", userController.verifyOtp);
userRoutes.post("/resend-otp",userController.resendOtp)
userRoutes.post("/login", userController.login);


// router.post("/forgot-password", userController.forgotPassword);
// router.post("/verify-reset-otp", userController.verifyResetOtp);
// router.post("/reset-password", userController.resetPassword);

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



// userRoutes.get(
//   "/profile",
//   authMiddleware(["user"]), 
//  
// );



export default userRoutes
