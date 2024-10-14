import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllPlaylist,
  createPlaylist,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
} from "../controller/playlist.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllPlaylist)
  .post(upload.single("image"), createPlaylist);

router
  .route("/:id")
  .get(getPlaylistById)
  .put(updatePlaylistById)
  .delete(deletePlaylistById);

export default router;
