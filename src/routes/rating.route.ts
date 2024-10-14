import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllRating,
  createRating,
  getRatingById,
  updateRatingById,
  deleteRatingById,
} from "../controller/rating.controller";

const router = express.Router();

router.route("/").get(getAllRating).post(upload.single("image"), createRating);

router
  .route("/:id")
  .get(getRatingById)
  .put(updateRatingById)
  .delete(deleteRatingById);

export default router;
