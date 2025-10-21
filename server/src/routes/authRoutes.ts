import {Router} from "express";
import authController from "../controllers/authController"

const authRoutes = Router();

authRoutes.post("/refresh-token", authController.refreshToken);

export default authRoutes;