import express from "express";
import {
  handleGetUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} from "../controller/user.controller";

const router = express.Router();

router.route("/").get(handleGetUsers).post(handleCreateUser);

router
  .route("/:id")
  .get(handleGetUserById)
  .put(handleUpdateUserById)
  .delete(handleDeleteUserById);

export default router;
