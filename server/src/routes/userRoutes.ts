import { Router } from "express";
import { container } from '../config/container';
import { IUserController } from '../controllers/interfaces/IUserController';
import { IPropertyController } from "../controllers/interfaces/IPropertyController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { TOKENS } from '../config/tokens';
//import userController from "../controllers/userController";
import passport from "passport";
import { authMiddleware } from "../middleware/authMiddleware";
import { cloudinaryUpload } from "../config/cloudinary";
import { checkUserStatus } from "../middleware/statusCheckingMiddleware";
import { PropertyController } from "../controllers/propertyController";

const userRoutes = Router();

const userController = container.resolve<IUserController>(TOKENS.IUserController);
const propertyController = container.resolve<IPropertyController>(TOKENS.IPropertyController);
const bookingController = container.resolve<IBookingController>(TOKENS.IBookingController);

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
   checkUserStatus,
  userController.getProfile.bind(userController)
);

userRoutes.put(
  "/profile",
  authMiddleware(["user"]),
   checkUserStatus,
  userController.updateProfile.bind(userController)
);


userRoutes.post(
  "/profile/upload-image",
  authMiddleware(["user"]),
   checkUserStatus,
  cloudinaryUpload.single("profileImage"), 
  userController.uploadProfileImage.bind(userController)
);


userRoutes.put(
  "/change-password",
  authMiddleware(["user"]),
   checkUserStatus,
  userController.changePassword.bind(userController)
);

userRoutes.get(
  "/properties",
  authMiddleware(["user"]),
  checkUserStatus,
  propertyController.getActiveProperties.bind(propertyController)
);

userRoutes.get(
  "/properties/:propertyId",
  authMiddleware(["user"]),
  checkUserStatus,
  propertyController.getActivePropertyById.bind(propertyController)
);

userRoutes.get(
  "/properties/:propertyId/check-availability",
  authMiddleware(["user"]),
  checkUserStatus,
  propertyController.checkAvailability.bind(propertyController)
)

userRoutes.post(
  "/payment/calculate-total",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.calculateTotal.bind(bookingController)
);

userRoutes.get(
  "/properties/:propertyId/blocked-dates",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.getBlockedDates.bind(bookingController)
);


userRoutes.post(
  "/payment/razorpay-order",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.createRazorpayOrder.bind(bookingController)
);

userRoutes.post(
  "/payment/verify",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.verifyPayment.bind(bookingController)

)

userRoutes.post(
  "/bookings",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.getUserBooking.bind(bookingController)

)

userRoutes.get(
  "/bookings/:bookingId",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.getBookingDetails.bind(bookingController)

)

userRoutes.get(
  "/destinations",
  authMiddleware(["user"]),
  checkUserStatus,
  propertyController.getDestinations.bind(propertyController)

)

userRoutes.post(
  "/bookings/:bookingId/cancel",
  authMiddleware(["user"]),
  checkUserStatus,
  bookingController.userCancelBooking.bind(bookingController)

)



export default userRoutes   



