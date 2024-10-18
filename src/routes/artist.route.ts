import express from "express";
import { upload } from "../lib/multer-config";
import {
  getAllArtist,
  createArtist,
  getArtistById,
  updateArtistById,
  deleteArtistById,
} from "../controller/artist.controller";

const router = express.Router();

router.route("/").get(getAllArtist).post(upload.single("img"), createArtist);

router
  .route("/:id")
  .get(getArtistById)
  .put(updateArtistById)
  .delete(deleteArtistById);

export default router;
