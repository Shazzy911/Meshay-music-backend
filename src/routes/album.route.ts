import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllAlbum,
  createAlbum,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
} from "../controller/album.controller";

const router = express.Router();

router.route("/").get(getAllAlbum).post(upload.single("image"), createAlbum);

router
  .route("/:id")
  .get(getAlbumById)
  .put(updateAlbumById)
  .delete(deleteAlbumById);

export default router;
