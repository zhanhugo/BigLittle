import express from "express";
import {
  getMatchesById, 
  RequestMatch, 
  UpdateMatch
} from "../controllers/matchController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, getMatchesById);
router
  .route("/:id")
  .post(protect, UpdateMatch);
router
  .route("/create")
  .put(protect, RequestMatch);

export default router;