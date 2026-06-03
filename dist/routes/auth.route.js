"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const router = express_1.default.Router();
// Specify HTTP methods for each route
router.post("/register", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.logInUser);
router.post("/logout", auth_controller_1.logOutUser);
exports.default = router;
