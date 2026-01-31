import { Router } from "express";
import { container } from '../config/container'
import { IOwnerController } from "../controllers/interfaces/IOwnerController";
import { IPropertyController } from "../controllers/interfaces/IPropertyController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { IReviewController } from "../controllers/interfaces/IReviewController";
import { TOKENS } from "../config/tokens";
//import ownerController from "../controllers/ownerController";
import { authMiddleware } from "../middleware/authMiddleware";
import { cloudinaryUpload } from "../config/cloudinary";
import { checkUserStatus } from "../middleware/statusCheckingMiddleware";
import { BookingController } from "../controllers/bookingController";

const ownerRoutes = Router();

const ownerController = container.resolve<IOwnerController>(TOKENS.IOwnerController);
const propertyController = container.resolve<IPropertyController>(TOKENS.IPropertyController);
const bookingController = container.resolve<IBookingController>(TOKENS.IBookingController);
const reviewController = container.resolve<IReviewController>(TOKENS.IReviewController);

ownerRoutes.post("/signup",ownerController.signup.bind(ownerController))
ownerRoutes.post("/verify-otp", ownerController.verifyOtp.bind(ownerController));
ownerRoutes.post("/resend-otp", ownerController.resendOtp.bind(ownerController));
ownerRoutes.post("/login", ownerController.login.bind(ownerController));

ownerRoutes.post("/forgot-password", ownerController.forgotPassword.bind(ownerController));
ownerRoutes.post("/reset-password", ownerController.resetPassword.bind(ownerController));

ownerRoutes.post(
  "/logout",
ownerController.logout.bind(ownerController)
);

ownerRoutes.get(
  "/profile",
  authMiddleware(["owner"]),
   checkUserStatus,
  ownerController.getProfile.bind(ownerController)
);

ownerRoutes.put(
  "/profile",
  authMiddleware(["owner"]),
   checkUserStatus,
  ownerController.updateProfile.bind(ownerController)
);

ownerRoutes.post(
  "/upload-document",
  authMiddleware(["owner"]),
   checkUserStatus,
  cloudinaryUpload.single('document'), 
  ownerController.uploadDocument.bind(ownerController)
);

ownerRoutes.post(
  "/properties",
  authMiddleware(["owner"]),
   checkUserStatus,
  cloudinaryUpload.array("images", 5),
  propertyController.createProperty.bind(propertyController)
);

ownerRoutes.get(
  "/properties",
  authMiddleware(["owner"]),
   checkUserStatus,
  propertyController.getOwnerProperties.bind(propertyController)
);

ownerRoutes.get(
  "/properties/:propertyId", 
  authMiddleware(["owner"]),  
   checkUserStatus,
   propertyController.getOwnerPropertyById.bind(propertyController)
);

ownerRoutes.put(
  "/properties/:propertyId",
  authMiddleware(["owner"]),
   checkUserStatus,
  cloudinaryUpload.array("images", 5),  
  propertyController.updateOwnerProperty.bind(propertyController)
);

ownerRoutes.delete(
  "/properties/:propertyId",
  authMiddleware(["owner"]),
   checkUserStatus,
  propertyController.deleteOwnerProperty.bind(propertyController)
);

ownerRoutes.put(
  "/change-password",
  authMiddleware(["owner"]),
  checkUserStatus,
  ownerController.changePassword.bind(ownerController)
);

ownerRoutes.get(
  "/wallet",
  authMiddleware(["owner"]),
  checkUserStatus,
  ownerController.getWallet.bind(ownerController)
);

ownerRoutes.get(
  "/bookings",
  authMiddleware(["owner"]),
  checkUserStatus,
  bookingController.getOwnerBookings.bind(bookingController)
);

ownerRoutes.get(
  "/bookings/:bookingId",
  authMiddleware(["owner"]),
  checkUserStatus,
  bookingController.getOwnerBookingDetails.bind(bookingController)
);


ownerRoutes.post(
  "/bookings/:bookingId/cancel",
  authMiddleware(["owner"]),
  checkUserStatus,
  bookingController.ownerCancelBooking.bind(bookingController)

)

ownerRoutes.get(
  "/dashboard/statis",
  authMiddleware(["owner"]),
  checkUserStatus,
  bookingController.getOwnerBookingStats.bind(bookingController)
);

ownerRoutes.get(
  "/dashboard/propertyStats",
  authMiddleware(["owner"]),
  checkUserStatus,
  propertyController.getOwnerPropertyStats.bind(propertyController)
);

ownerRoutes.get(
  "/properties/:propertyId/reviews",
  authMiddleware(["owner"]),
  reviewController.getReviewsByPropertyForOwner.bind(reviewController)
);



export default ownerRoutes
