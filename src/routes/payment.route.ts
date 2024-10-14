import express from "express";
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
import {
  getAllPayment,
  createPayment,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
} from "../controller/payment.controller";

const router = express.Router();

router
  .route("/")
  .get(getAllPayment)
  .post(upload.single("image"), createPayment);

router
  .route("/:id")
  .get(getPaymentById)
  .put(updatePaymentById)
  .delete(deletePaymentById);

export default router;
