"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentById = exports.updatePaymentById = exports.getPaymentById = exports.createPayment = exports.getAllPayment = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllPayment = async (req, resp) => {
    try {
        const payment = await prisma_1.default.payment.findMany();
        if (!payment || payment.length === 0) {
            resp.status(404).json({
                message: "Payment not Found",
            });
            return;
        }
        resp.status(200).json({
            data: payment,
            message: "Payments fetched successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({ error });
        return;
    }
};
exports.getAllPayment = getAllPayment;
const createPayment = async (req, resp) => {
    try {
        const { userId, subscriptionId, amount, date, method } = req.body;
        if (!userId || !subscriptionId || !amount || !date || !method) {
            resp.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const data = await prisma_1.default.payment.create({
            data: {
                userId,
                subscriptionId,
                amount,
                date,
                method,
            },
        });
        resp.status(201).json({
            success: true,
            result: data,
            message: "Payment Information Saved Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Error Saving Information",
        });
        return;
    }
};
exports.createPayment = createPayment;
const getPaymentById = async (req, resp) => {
    try {
        const paymentId = req.params.id;
        const data = await prisma_1.default.payment.findUnique({
            where: {
                id: paymentId,
            },
        });
        if (!data) {
            resp.status(404).json({
                message: "Payment not found",
            });
            return;
        }
        resp.status(200).json({
            data,
            message: "Payment Information Successfully Found",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Payment Info Not Found",
        });
        return;
    }
};
exports.getPaymentById = getPaymentById;
const updatePaymentById = async (req, resp) => {
    try {
        const paymentId = req.params.id;
        const body = req.body;
        const existingPayment = await prisma_1.default.payment.findUnique({
            where: {
                id: paymentId,
            },
        });
        if (!existingPayment) {
            resp.status(404).json({
                message: "Payment Not Found",
            });
            return;
        }
        const updatedData = {
            ...body,
        };
        const payment = await prisma_1.default.payment.update({
            where: {
                id: paymentId,
            },
            data: updatedData,
        });
        resp.status(200).json({
            data: payment,
            message: "Payment Info Updated Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Payment Info Not Updated Successfully",
        });
        return;
    }
};
exports.updatePaymentById = updatePaymentById;
const deletePaymentById = async (req, resp) => {
    try {
        const paymentId = req.params.id;
        const existingPayment = await prisma_1.default.payment.findUnique({
            where: {
                id: paymentId,
            },
        });
        if (!existingPayment) {
            resp.status(404).json({
                message: "Payment Not Found",
            });
            return;
        }
        const payment = await prisma_1.default.payment.delete({
            where: {
                id: paymentId,
            },
        });
        resp.status(200).json({
            payment,
            message: "Payment deleted successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Payment Not Found",
        });
        return;
    }
};
exports.deletePaymentById = deletePaymentById;
