import { Router } from "express";
import {container} from '../config/container';
import { IAdminController } from "../controllers/interfaces/IAdminController";
//import adminController from '../controllers/adminController'
import {TOKENS} from '../config/tokens'
import { authMiddleware } from "../middleware/authMiddleware";

const adminRoutes = Router();
const adminController = container.resolve<IAdminController>(TOKENS.IAdminController);

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



export default adminRoutes;