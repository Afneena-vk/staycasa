import { Router } from "express";
import { container } from '../config/container'
import { IOwnerController } from "../controllers/interfaces/IOwnerController";
import { IPropertyController } from "../controllers/interfaces/IPropertyController";
import { TOKENS } from "../config/tokens";
//import ownerController from "../controllers/ownerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { cloudinaryUpload } from "../config/cloudinary";

const ownerRoutes = Router();
const ownerController = container.resolve<IOwnerController>(TOKENS.IOwnerController);
const propertyController = container.resolve<IPropertyController>(TOKENS.IPropertyController);

ownerRoutes.post("/signup",ownerController.signup.bind(ownerController))
ownerRoutes.post("/verify-otp", ownerController.verifyOtp.bind(ownerController));
ownerRoutes.post("/resend-otp", ownerController.resendOtp.bind(ownerController));
ownerRoutes.post("/login", ownerController.login.bind(ownerController));

ownerRoutes.post("/forgot-password", ownerController.forgotPassword.bind(ownerController));
ownerRoutes.post("/reset-password", ownerController.resetPassword.bind(ownerController));

ownerRoutes.post(
  "/logout",
 authMiddleware(["owner"]),
ownerController.logout.bind(ownerController)
);

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

ownerRoutes.post(
  "/properties",
  authMiddleware(["owner"]),
  cloudinaryUpload.array("images", 5),
  propertyController.createProperty.bind(propertyController)
);

ownerRoutes.get(
  "/properties",
  authMiddleware(["owner"]),
  propertyController.getOwnerProperties.bind(propertyController)
);

ownerRoutes.get(
  "/properties/:propertyId", 
  authMiddleware(["owner"]),  
   propertyController.getOwnerPropertyById.bind(propertyController)
);

ownerRoutes.put(
  "/properties/:propertyId",
  authMiddleware(["owner"]),
  cloudinaryUpload.array("images", 5),  
  propertyController.updateOwnerProperty.bind(propertyController)
);

ownerRoutes.delete(
  "/properties/:propertyId",
  authMiddleware(["owner"]),
  propertyController.deleteOwnerProperty.bind(propertyController)
);


export default ownerRoutes
