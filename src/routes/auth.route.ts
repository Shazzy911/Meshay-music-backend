import express from "express";
import {
  registerUser,
  logInUser,
  logOutUser,
} from "../controller/auth.controller";

const router = express.Router();

// Specify HTTP methods for each route
router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
export default router;
