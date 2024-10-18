import express from "express";
import { upload } from "../lib/multer-config";
import {
  getAllAlbum,
  createAlbum,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
} from "../controller/album.controller";

const router = express.Router();

router.route("/").get(getAllAlbum).post(upload.single("img"), createAlbum);

router
  .route("/:id")
  .get(getAlbumById)
  .put(updateAlbumById)
  .delete(deleteAlbumById);

export default router;
