import express from "express";
import { upload } from "../lib/multer-config";

import {
  getAllSong,
  createSong,
  getSongById,
  updateSongById,
  deleteSongById,
} from "../controller/song.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllSong)
  .post(
    upload.fields([
      { name: "img", maxCount: 1 },
      { name: "songUrl", maxCount: 1 },
    ]),
    createSong
  );

router
  .route("/:id")
  .get(getSongById)
  .put(updateSongById)
  .delete(deleteSongById);

export default router;
