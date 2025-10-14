import { Router } from "express";
import {container} from '../config/container';
import { IAdminController } from "../controllers/interfaces/IAdminController";
//import adminController from '../controllers/adminController'
import {TOKENS} from '../config/tokens'
import { authMiddleware } from "../middleware/authMiddleware";
import { PropertyController } from "../controllers/propertyController";
import { IPropertyController } from "../controllers/interfaces/IPropertyController";

const adminRoutes = Router();
const adminController = container.resolve<IAdminController>(TOKENS.IAdminController);
const propertyController = container.resolve<IPropertyController>(TOKENS.IPropertyController)

adminRoutes.post("/login", adminController.login.bind(adminController));
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


export default adminRoutes;