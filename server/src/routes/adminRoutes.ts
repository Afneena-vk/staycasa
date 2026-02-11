import { Router } from "express";
import {container} from '../config/container';
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { IReviewController } from "../controllers/interfaces/IReviewController";
import { INotificationController } from "../controllers/interfaces/INotificationController";
//import adminController from '../controllers/adminController'
import {TOKENS} from '../config/tokens'
import { authMiddleware } from "../middleware/authMiddleware";
import { PropertyController } from "../controllers/propertyController";
import { IPropertyController } from "../controllers/interfaces/IPropertyController";
import { BookingController } from "../controllers/bookingController";
import { ReviewController } from "../controllers/reviewController";
import { IAdminSubscriptionController } from "../controllers/interfaces/IAdminSubscriptionController";
import { ISubscriptionController } from "../controllers/interfaces/ISubscriptionController";

const adminRoutes = Router();
const adminController = container.resolve<IAdminController>(TOKENS.IAdminController);
const propertyController = container.resolve<IPropertyController>(TOKENS.IPropertyController);
const bookingController = container.resolve<IBookingController>(TOKENS.IBookingController)
const reviewController = container.resolve<IReviewController>(TOKENS.IReviewController)
const notificationController = container.resolve<INotificationController>(TOKENS.INotificationController);
const adminSubscriptionController = container.resolve<IAdminSubscriptionController>(TOKENS.IAdminSubscriptionController);
const subscriptionController = container.resolve<ISubscriptionController>(TOKENS.ISubscriptionController);

adminRoutes.post("/login", adminController.login.bind(adminController));
adminRoutes.post(
  "/logout",
adminController.logout.bind(adminController)
);

adminRoutes.get(
    "/users", 
    authMiddleware(["admin"]), 
    adminController.getUsersList.bind(adminController)
);

adminRoutes.patch(
    "/users/:userId/block", 
    authMiddleware(["admin"]), 
    adminController.blockUser.bind(adminController)
);

adminRoutes.patch(
    "/users/:userId/unblock", 
    authMiddleware(["admin"]), 
    adminController.unblockUser.bind(adminController)
);

adminRoutes.get(
  "/users/:userId", 
  authMiddleware(["admin"]), 
  adminController.getUserById.bind(adminController)
);

adminRoutes.get(
  "/owners",
  authMiddleware(["admin"]),
  adminController.getOwnersList.bind(adminController)
);

adminRoutes.patch(
    "/owners/:ownerId/block", 
    authMiddleware(["admin"]), 
    adminController.blockOwner.bind(adminController)
);

adminRoutes.patch(
    "/owners/:ownerId/unblock", 
    authMiddleware(["admin"]), 
    adminController.unblockOwner.bind(adminController)
);

adminRoutes.get(
  "/owners/:ownerId", 
  authMiddleware(["admin"]), 
  adminController.getOwnerById.bind(adminController)
);

adminRoutes.patch(
    "/owners/:ownerId/approve",
    authMiddleware(["admin"]),
    adminController.approveOwner.bind(adminController)
);

adminRoutes.patch(
    "/owners/:ownerId/reject",
    authMiddleware(["admin"]),
    adminController.rejectOwner.bind(adminController)
);

adminRoutes.get(
    "/properties",
    authMiddleware(["admin"]),
    
    propertyController.getAllProperties.bind(propertyController)
)

adminRoutes.get(
    "/properties/:propertyId",
    authMiddleware(["admin"]),
    
    propertyController.getAdminPropertyById.bind(propertyController)
)

adminRoutes.patch(
    "/properties/:propertyId/approve",
    authMiddleware(["admin"]),
   
    propertyController.approveProperty.bind(propertyController)
)

adminRoutes.patch(
    "/properties/:propertyId/reject",
    authMiddleware(["admin"]),
   
    propertyController.rejectProperty.bind(propertyController)
)

adminRoutes.patch(
    "/properties/:propertyId/block",
    authMiddleware(["admin"]),
   
    propertyController.blockPropertyByAdmin.bind(propertyController)
)

adminRoutes.patch(
    "/properties/:propertyId/unblock",
    authMiddleware(["admin"]),
   
    propertyController.unblockPropertyByAdmin.bind(propertyController)
)

// adminRoutes.get(
//     "/bookings-overview",
//     authMiddleware(["admin"]),
//     bookingController.getBookingOverview.bind(bookingController)
    
// )

// adminRoutes.get(
//     "/statistics",
//     authMiddleware(["admin"]),
//     adminController.adminUserStatistics.bind(adminController)
    
// )

adminRoutes.get(
    "/bookings",
    authMiddleware(["admin"]),
    bookingController.getAllBookings.bind(bookingController)
    
)


adminRoutes.get(
    "/bookings/:bookingId",
    authMiddleware(["admin"]),
    bookingController.getBookingDetailsForAdmin.bind(bookingController)
    
)

adminRoutes.get(
  "/dashboard",
  authMiddleware(["admin"]), 
  adminController.getDashboardStats.bind(adminController)
);

adminRoutes.get(
  "/properties/:propertyId/reviews",
  authMiddleware(["admin"]),
  reviewController.getReviewsByPropertyForAdmin.bind(reviewController)
);

adminRoutes.patch(
  "/reviews/:reviewId/toggle-visibility",
  authMiddleware(["admin"]),
  reviewController.toggleReviewVisibility.bind(reviewController)
);

adminRoutes.get(
  "/notifications",
  authMiddleware(["admin"]),
  
  notificationController.getNotifications.bind(notificationController)
);


adminRoutes.patch(
  "/notifications/:notificationId/read",
  authMiddleware(["admin"]),
  
  notificationController.markAsRead.bind(notificationController)
);

adminRoutes.patch(
  "/notifications/read-all",
  authMiddleware(["admin"]),
  
  notificationController.markAllAsRead.bind(notificationController)
);

adminRoutes.delete(
  "/notifications/:notificationId",
  authMiddleware(["admin"]),
   notificationController.deleteNotification.bind(notificationController)
);


adminRoutes.get(
  "/subscription-plans",
  authMiddleware(["admin"]),
   adminSubscriptionController.getAllPlans.bind(adminSubscriptionController)
);


adminRoutes.patch(
  "/subscription-plans/:planId",
  authMiddleware(["admin"]),
   adminSubscriptionController.updatePlan.bind(adminSubscriptionController)
);

adminRoutes.get(
  "/subscriptions",
  authMiddleware(["admin"]),
   subscriptionController.getAllSubscriptions.bind(subscriptionController)
);



export default adminRoutes;