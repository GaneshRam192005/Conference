import express from "express";
import { createReviewer, getReviewers, assignReviewer, getReviewersWithAssignments } from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-reviewer", authenticateToken, createReviewer);
router.get("/reviewers", authenticateToken, getReviewers);
router.post("/assign-reviewer", authenticateToken, assignReviewer);
router.get("/reviewers-with-assignments", authenticateToken, getReviewersWithAssignments);

export default router;
