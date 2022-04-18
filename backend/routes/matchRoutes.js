import express from "express";
import {
  getMatchesById, 
  RequestMatch, 
  DeleteMatch, 
  ConfirmMatch
} from "../controllers/matchController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, getMatchesById);
router
  .route("/:id")
  .delete(protect, DeleteMatch)
  .put(protect, ConfirmMatch);
router
  .route("/create")
  .post(protect, RequestMatch);

export default router;