"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentById = exports.updatePaymentById = exports.getPaymentById = exports.createPayment = exports.getAllPayment = void 0;
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
// import { supabase } from "../lib/supabaseClient";
const getAllPayment = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Payment = yield prisma_config_1.default.payment.findMany();
        if (!Payment || Payment.length === 0) {
            resp.status(404).json({ message: "Payment not Found" });
        }
        resp.status(200).json(Payment);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
});
exports.getAllPayment = getAllPayment;
const createPayment = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, subscriptionId, amount, date, method } = req.body;
        if (!userId || !subscriptionId || !amount || !date || !method) {
            resp.status(404).json({ message: "All fields are required" });
        }
        // Upload the image to a specific folder in your Supabase storage bucket
        // const { data: storageData, error: storageError } = await supabase.storage
        //   .from("music-store")
        //   .upload(`Payment/${file.originalname}`, file.buffer, {
        //     cacheControl: "3600",
        //     upsert: false,
        //     contentType: file.mimetype,
        //   });
        // if (storageError) {
        //   return resp
        //     .status(500)
        //     .json({
        //       error: storageError,
        //       message: "Error uploading image to Supabase",
        //     });
        // }
        // Get the public URL for the image
        // const { data: urlData, error: urlError } = supabase.storage
        //   .from("music-store")
        //   .getPublicUrl(`images/${file.originalname}`);
        // if (urlError || !urlData) {
        //   return resp.status(500).json({
        //     error: urlError,
        //     message: "Error generating public URL for the image",
        //   });
        // }
        const data = yield prisma_config_1.default.payment.create({
            data: {
                userId,
                subscriptionId,
                amount,
                date,
                method,
            },
        });
        resp.status(201).json({
            result: data,
            message: "Payment Information Saved Successfully",
        });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
});
exports.createPayment = createPayment;
/// Payment By Id.
const getPaymentById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PaymentId = req.params.id;
        let data = yield prisma_config_1.default.payment.findUnique({
            where: {
                id: PaymentId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Payment not found" });
        }
        else {
            resp
                .status(200)
                .json({ data: data, message: "Payment Infomation Successfully Found" });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Payment Info Not Updated Successfully" });
    }
});
exports.getPaymentById = getPaymentById;
const updatePaymentById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PaymentId = req.params.id;
        const body = req.body;
        const existingPayment = yield prisma_config_1.default.payment.findUnique({
            where: {
                id: PaymentId,
            },
        });
        if (!existingPayment) {
            resp.status(404).json({ message: "Payment Not Found" });
        }
        let updatedData = Object.assign({}, body);
        // let data = await Payment.updateOne({ PaymentId }, updatePayment);
        const Payment = yield prisma_config_1.default.payment.update({
            where: { id: PaymentId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: Payment, message: "Payment Info Updated Successfully" });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Payment Info Not Updated Successfully" });
    }
});
exports.updatePaymentById = updatePaymentById;
const deletePaymentById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PaymentId = req.params.id;
        const existingPayment = yield prisma_config_1.default.payment.findUnique({
            where: {
                id: PaymentId,
            },
        });
        if (!existingPayment) {
            resp.status(404).json({ message: "Payment Not Found" });
        }
        const Payment = yield prisma_config_1.default.payment.delete({
            where: { id: PaymentId },
        });
        resp.status(200).json({ Payment, message: "Payment deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Payment Not Found" });
    }
});
exports.deletePaymentById = deletePaymentById;
