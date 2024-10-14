import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllPlaylistSong,
  createPlaylistSong,
  getPlaylistSongById,
  updatePlaylistSongById,
  deletePlaylistSongById,
} from "../controller/playlistSong.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllPlaylistSong)
  .post(upload.single("image"), createPlaylistSong);

router
  .route("/:id")
  .get(getPlaylistSongById)
  .put(updatePlaylistSongById)
  .delete(deletePlaylistSongById);

export default router;
