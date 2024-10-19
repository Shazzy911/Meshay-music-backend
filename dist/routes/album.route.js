"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../lib/multer-config");
const album_controller_1 = require("../controller/album.controller");
const router = express_1.default.Router();
router.route("/").get(album_controller_1.getAllAlbum).post(multer_config_1.upload.single("img"), album_controller_1.createAlbum);
router
    .route("/:id")
    .get(album_controller_1.getAlbumById)
    .put(album_controller_1.updateAlbumById)
    .delete(album_controller_1.deleteAlbumById);
exports.default = router;
