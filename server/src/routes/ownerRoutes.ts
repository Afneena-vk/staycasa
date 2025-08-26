import { Router } from "express";
import { container } from '../config/container'
import { IOwnerController } from "../controllers/interfaces/IOwnerController";
import { TOKENS } from "../config/tokens";
//import ownerController from "../controllers/ownerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { cloudinaryUpload } from "../config/cloudinary";

const ownerRoutes = Router();
const ownerController = container.resolve<IOwnerController>(TOKENS.IOwnerController);

ownerRoutes.post("/signup",ownerController.signup.bind(ownerController))
ownerRoutes.post("/verify-otp", ownerController.verifyOtp.bind(ownerController));
ownerRoutes.post("/resend-otp", ownerController.resendOtp.bind(ownerController));
ownerRoutes.post("/login", ownerController.login.bind(ownerController));

ownerRoutes.post("/forgot-password", ownerController.forgotPassword.bind(ownerController));
ownerRoutes.post("/reset-password", ownerController.resetPassword.bind(ownerController));


// ownerRoutes.get(
//   "/profile",
//   authMiddleware(["owner"]),
//   (req, res) => {
//     res.json({
//       ownerId: (req as any).userId,
//       userType: (req as any).userType,
//     });
//   }
// );

ownerRoutes.get(
  "/profile",
  authMiddleware(["owner"]),
  ownerController.getProfile.bind(ownerController)
);

ownerRoutes.put(
  "/profile",
  authMiddleware(["owner"]),
  ownerController.updateProfile.bind(ownerController)
);

ownerRoutes.post(
  "/upload-document",
  authMiddleware(["owner"]),
  cloudinaryUpload.single('document'), 
  ownerController.uploadDocument.bind(ownerController)
);

export default ownerRoutes
