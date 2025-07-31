import { Router } from "express";
import {container} from '../config/container';
import { IAdminController } from "../controllers/interfaces/IAdminController";
//import adminController from '../controllers/adminController'
import {TOKENS} from '../config/tokens'
import { authMiddleware } from "../middleware/authMiddleware";

const adminRoutes = Router();
const adminController = container.resolve<IAdminController>(TOKENS.IAdminController);

adminRoutes.post("/login", adminController.login.bind(adminController));
export default adminRoutes;