import express from "express";
import {
  handleGetUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} from "../controller/user.controller";

const router = express.Router();

router.get("/", handleGetUsers).put(handleCreateUser);
// router.route("/:id").get(handleGetUserById).patch().delete() // Here we're doing grouping because URL is same.
router
  .route("/:id")
  .get(handleGetUserById)
  .put(handleUpdateUserById)
  .delete(handleDeleteUserById);

export default router;
