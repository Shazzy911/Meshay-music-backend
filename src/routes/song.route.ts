import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllSong,
  createSong,
  getSongById,
  updateSongById,
  deleteSongById,
} from "../controller/song.controller";

const router = express.Router();

router.route("/").get(getAllSong).post(upload.single("image"), createSong);

router
  .route("/:id")
  .get(getSongById)
  .put(updateSongById)
  .delete(deleteSongById);

export default router;
