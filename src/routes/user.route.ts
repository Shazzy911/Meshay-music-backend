import express from "express";
import {
  handleGetUsers,
  handleGetUserById,
} from "../controller/user.controller";

const router = express.Router();

router.get("/", handleGetUsers);
// router.route("/:id").get(handleGetUserById).patch().delete() // Here we're doing grouping because URL is same. 
router.route("/:id").get(handleGetUserById);

export default router;
