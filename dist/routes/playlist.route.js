"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const playlist_controller_1 = require("../controller/playlist.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(playlist_controller_1.getAllPlaylist)
    .post(upload.single("image"), playlist_controller_1.createPlaylist);
router
    .route("/:id")
    .get(playlist_controller_1.getPlaylistById)
    .put(playlist_controller_1.updatePlaylistById)
    .delete(playlist_controller_1.deletePlaylistById);
exports.default = router;
