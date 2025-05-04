import { Router } from "express";
import ownerRoutes from "./ownerRoutes";
import userRoutes from "./userRoutes";
//import authRoutes from "./auth.routes";
//import adminRoutes from "./adminRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/owner", ownerRoutes);
//router.use("/admin", adminRoutes);

export default router;