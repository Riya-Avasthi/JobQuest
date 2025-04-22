import express from "express";
import { getUserProfile } from "../controllers/usercontroller.js";

const router = express.Router();

// Test endpoint to check connection
router.get("/test", (req, res) => {
  return res.status(200).json({ message: "Backend connection successful!" });
});

router.get("/check-auth", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // return auth status
    return res.status(200).json({
      isAuthenticated: true,
      user: req.oidc.user,
    });
  } else {
    return res.status(200).json(false);
  }
});

router.get("/logout", (req, res) => {
  // Auth0 will handle the actual logout via the middleware
  // This route is just to provide a consistent API endpoint
  req.logout();
  return res.status(200).json({ message: "Logged out successfully" });
});

router.get("/user/:id", getUserProfile);

export default router;