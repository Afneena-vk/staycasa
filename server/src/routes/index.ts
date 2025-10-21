import { Router } from "express";
import ownerRoutes from "./ownerRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";

const router = Router();

// router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/owner", ownerRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

export default router;