"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const router = express_1.default.Router();
router.route("/").get(user_controller_1.getAllUsers).post(user_controller_1.createUser);
router
    .route("/:id")
    .get(user_controller_1.getUserById)
    .put(user_controller_1.updateUserById)
    .delete(user_controller_1.deleteUserById);
exports.default = router;
