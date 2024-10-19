"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const playlistSong_controller_1 = require("../controller/playlistSong.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(playlistSong_controller_1.getAllPlaylistSong)
    .post(upload.single("image"), playlistSong_controller_1.createPlaylistSong);
router
    .route("/:id")
    .get(playlistSong_controller_1.getPlaylistSongById)
    .put(playlistSong_controller_1.updatePlaylistSongById)
    .delete(playlistSong_controller_1.deletePlaylistSongById);
exports.default = router;
