"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionById = exports.updateSubscriptionById = exports.getSubscriptionById = exports.createSubscription = exports.getAllSubscription = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllSubscription = async (req, resp) => {
    try {
        const subscription = await prisma_1.default.subscription.findMany();
        if (!subscription || subscription.length === 0) {
            resp.status(404).json({ message: "Subscription not Found" });
            return;
        }
        resp.status(200).json(subscription);
        return;
    }
    catch (error) {
        resp.status(500).json({ error });
        return;
    }
};
exports.getAllSubscription = getAllSubscription;
const createSubscription = async (req, resp) => {
    try {
        const { userId, status, plan, startDate, endDate } = req.body;
        if (!status || !plan || !userId || !startDate || !endDate) {
            resp.status(400).json({ message: "All fields are required" });
            return;
        }
        const data = await prisma_1.default.subscription.create({
            data: {
                userId,
                status,
                plan,
                startDate,
                endDate,
            },
        });
        resp.status(201).json({
            result: data,
            message: "Subscription Information Saved Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
        return;
    }
};
exports.createSubscription = createSubscription;
const getSubscriptionById = async (req, resp) => {
    try {
        const subscriptionId = req.params.id;
        const data = await prisma_1.default.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!data) {
            resp.status(404).json({ message: "Subscription not found" });
            return;
        }
        resp.status(200).json({
            data,
            message: "Subscription Successfully Found",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Subscription fetch failed",
        });
        return;
    }
};
exports.getSubscriptionById = getSubscriptionById;
const updateSubscriptionById = async (req, resp) => {
    try {
        const subscriptionId = req.params.id;
        const body = req.body;
        const existingSubscription = await prisma_1.default.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!existingSubscription) {
            resp.status(404).json({ message: "Subscription Not Found" });
            return;
        }
        const subscription = await prisma_1.default.subscription.update({
            where: { id: subscriptionId },
            data: { ...body },
        });
        resp.status(200).json({
            data: subscription,
            message: "Subscription Updated Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Subscription update failed",
        });
        return;
    }
};
exports.updateSubscriptionById = updateSubscriptionById;
const deleteSubscriptionById = async (req, resp) => {
    try {
        const subscriptionId = req.params.id;
        const existingSubscription = await prisma_1.default.subscription.findUnique({
            where: { id: subscriptionId },
        });
        if (!existingSubscription) {
            resp.status(404).json({ message: "Subscription Not Found" });
            return;
        }
        const subscription = await prisma_1.default.subscription.delete({
            where: { id: subscriptionId },
        });
        resp.status(200).json({
            subscription,
            message: "Subscription deleted successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Subscription delete failed",
        });
        return;
    }
};
exports.deleteSubscriptionById = deleteSubscriptionById;
