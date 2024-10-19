"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../lib/multer-config");
const song_controller_1 = require("../controller/song.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(song_controller_1.getAllSong)
    .post(multer_config_1.upload.fields([
    { name: "img", maxCount: 1 },
    { name: "songUrl", maxCount: 1 },
]), song_controller_1.createSong);
router
    .route("/:id")
    .get(song_controller_1.getSongById)
    .put(song_controller_1.updateSongById)
    .delete(song_controller_1.deleteSongById);
exports.default = router;
