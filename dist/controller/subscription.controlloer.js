"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionById = exports.updateSubscriptionById = exports.getSubscriptionById = exports.createSubscription = exports.getAllSubscription = void 0;
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
// import { supabase } from "../lib/supabaseClient";
const getAllSubscription = async (req, resp) => {
    try {
        let Subscription = await prisma_config_1.default.subscription.findMany();
        if (!Subscription || Subscription.length === 0) {
            resp.status(404).json({ message: "Subscription not Found" });
        }
        resp.status(200).json(Subscription);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
};
exports.getAllSubscription = getAllSubscription;
const createSubscription = async (req, resp) => {
    try {
        const { userId, status, plan, startDate, endDate } = req.body;
        if (!status || !plan || !userId || !startDate || !endDate) {
            resp.status(404).json({ message: "All fields are required" });
        }
        // Upload the image to a specific folder in your Supabase storage bucket
        // const { data: storageData, error: storageError } = await supabase.storage
        //   .from("music-store")
        //   .upload(`Subscription/${file.originalname}`, file.buffer, {
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
        const data = await prisma_config_1.default.subscription.create({
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
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
};
exports.createSubscription = createSubscription;
/// Subscription By Id.
const getSubscriptionById = async (req, resp) => {
    try {
        const SubscriptionId = req.params.id;
        let data = await prisma_config_1.default.subscription.findUnique({
            where: {
                id: SubscriptionId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Subscription not found" });
        }
        else {
            resp.status(200).json({
                data: data,
                message: "Subscription Infomation Successfully Found",
            });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Subscription Info Not Updated Successfully" });
    }
};
exports.getSubscriptionById = getSubscriptionById;
const updateSubscriptionById = async (req, resp) => {
    try {
        const SubscriptionId = req.params.id;
        const body = req.body;
        const existingSubscription = await prisma_config_1.default.subscription.findUnique({
            where: {
                id: SubscriptionId,
            },
        });
        if (!existingSubscription) {
            resp.status(404).json({ message: "Subscription Not Found" });
        }
        let updatedData = {
            ...body,
        };
        // let data = await Subscription.updateOne({ SubscriptionId }, updateSubscription);
        const Subscription = await prisma_config_1.default.subscription.update({
            where: { id: SubscriptionId },
            data: updatedData,
        });
        resp.status(200).json({
            data: Subscription,
            message: "Subscription Info Updated Successfully",
        });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Subscription Info Not Updated Successfully" });
    }
};
exports.updateSubscriptionById = updateSubscriptionById;
const deleteSubscriptionById = async (req, resp) => {
    try {
        const SubscriptionId = req.params.id;
        const existingSubscription = await prisma_config_1.default.subscription.findUnique({
            where: {
                id: SubscriptionId,
            },
        });
        if (!existingSubscription) {
            resp.status(404).json({ message: "Subscription Not Found" });
        }
        const Subscription = await prisma_config_1.default.subscription.delete({
            where: { id: SubscriptionId },
        });
        resp
            .status(200)
            .json({ Subscription, message: "Subscription deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Subscription Not Found" });
    }
};
exports.deleteSubscriptionById = deleteSubscriptionById;
