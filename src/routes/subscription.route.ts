import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllSubscription,
  createSubscription,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
} from "../controller/subscription.controlloer";

const router = express.Router();

router
  .route("/")
  .get(getAllSubscription)
  .post(upload.single("image"), createSubscription);

router
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscriptionById)
  .delete(deleteSubscriptionById);

export default router;
