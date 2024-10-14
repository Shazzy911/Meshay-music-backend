import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllArtist,
  createArtist,
  getArtistById,
  updateArtistById,
  deleteArtistById,
} from "../controller/artist.controller";

const router = express.Router();

router.route("/").get(getAllArtist).post(upload.single("image"), createArtist);

router
  .route("/:id")
  .get(getArtistById)
  .put(updateArtistById)
  .delete(deleteArtistById);

export default router;
