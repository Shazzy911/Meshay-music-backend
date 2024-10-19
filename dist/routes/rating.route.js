"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const rating_controller_1 = require("../controller/rating.controller");
const router = express_1.default.Router();
router.route("/").get(rating_controller_1.getAllRating).post(upload.single("image"), rating_controller_1.createRating);
router
    .route("/:id")
    .get(rating_controller_1.getRatingById)
    .put(rating_controller_1.updateRatingById)
    .delete(rating_controller_1.deleteRatingById);
exports.default = router;
