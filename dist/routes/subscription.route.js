"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const subscription_controlloer_1 = require("../controller/subscription.controlloer");
const router = express_1.default.Router();
router
    .route("/")
    .get(subscription_controlloer_1.getAllSubscription)
    .post(upload.single("image"), subscription_controlloer_1.createSubscription);
router
    .route("/:id")
    .get(subscription_controlloer_1.getSubscriptionById)
    .put(subscription_controlloer_1.updateSubscriptionById)
    .delete(subscription_controlloer_1.deleteSubscriptionById);
exports.default = router;
