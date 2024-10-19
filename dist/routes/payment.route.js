"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const payment_controller_1 = require("../controller/payment.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(payment_controller_1.getAllPayment)
    .post(upload.single("image"), payment_controller_1.createPayment);
router
    .route("/:id")
    .get(payment_controller_1.getPaymentById)
    .put(payment_controller_1.updatePaymentById)
    .delete(payment_controller_1.deletePaymentById);
exports.default = router;
