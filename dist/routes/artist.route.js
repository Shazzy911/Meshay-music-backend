"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../lib/multer-config");
const artist_controller_1 = require("../controller/artist.controller");
const router = express_1.default.Router();
router.route("/").get(artist_controller_1.getAllArtist).post(multer_config_1.upload.single("img"), artist_controller_1.createArtist);
router
    .route("/:id")
    .get(artist_controller_1.getArtistById)
    .put(artist_controller_1.updateArtistById)
    .delete(artist_controller_1.deleteArtistById);
exports.default = router;
