import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateUser,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/auth/register", register);
router.post("/auth/login", login);

// Protected routes
router.get("/auth/me", auth, getCurrentUser);
router.patch("/auth/update", auth, updateUser);

export default router; 