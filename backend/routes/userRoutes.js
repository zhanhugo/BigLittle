import express from "express";
import {
  authUser,
  getUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(getUser);
router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/profile").post(protect, updateUserProfile);

export default router;
