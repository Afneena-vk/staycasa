import { Router } from "express";
import adminController from '../controllers/adminController'
const adminRoutes = Router();

adminRoutes.post("/login", adminController.login);
export default adminRoutes;