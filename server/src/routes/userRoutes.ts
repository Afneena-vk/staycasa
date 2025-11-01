import { Router } from "express";
import { container } from '../config/container';
import { IUserController } from '../controllers/interfaces/IUserController';
import { TOKENS } from '../config/tokens';
//import userController from "../controllers/userController";
import passport from "passport";
import { authMiddleware } from "../middleware/authMiddleware";
import { cloudinaryUpload } from "../config/cloudinary";

const userRoutes = Router();

const userController = container.resolve<IUserController>(TOKENS.IUserController);


userRoutes.post("/signup", userController.signup.bind(userController));
userRoutes.post("/verify-otp", userController.verifyOtp.bind(userController));
userRoutes.post("/resend-otp",userController.resendOtp.bind(userController))
userRoutes.post("/login", userController.login.bind(userController));

userRoutes.post("/forgot-password", userController.forgotPassword.bind(userController));
userRoutes.post("/reset-password", userController.resetPassword.bind(userController));


userRoutes.post(
  "/logout",
  userController.logout.bind(userController)
);

userRoutes.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account", })
  );
  

  userRoutes.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    userController.googleCallback.bind(userController)
  );




userRoutes.get(
  "/profile",
  authMiddleware(["user"]),
  userController.getProfile.bind(userController)
);

userRoutes.put(
  "/profile",
  authMiddleware(["user"]),
  userController.updateProfile.bind(userController)
);


userRoutes.post(
  "/profile/upload-image",
  authMiddleware(["user"]),
  cloudinaryUpload.single("profileImage"), 
  userController.uploadProfileImage.bind(userController)
);

export default userRoutes   



