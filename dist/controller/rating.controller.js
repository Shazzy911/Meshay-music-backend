"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRatingById = exports.updateRatingById = exports.getRatingById = exports.createRating = exports.getAllRating = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllRating = async (req, resp) => {
    try {
        const rating = await prisma_1.default.rating.findMany();
        if (!rating || rating.length === 0) {
            resp.status(404).json({
                message: "Rating not Found",
            });
            return;
        }
        resp.status(200).json({
            data: rating,
            message: "Ratings fetched successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({ error });
        return;
    }
};
exports.getAllRating = getAllRating;
const createRating = async (req, resp) => {
    try {
        const { rating, userId, songId } = req.body;
        if (!rating || !songId || !userId) {
            resp.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const data = await prisma_1.default.rating.create({
            data: {
                userId,
                songId,
                rating,
            },
        });
        resp.status(201).json({
            success: true,
            result: data,
            message: "Rating Information Saved Successfully",
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
exports.createRating = createRating;
const getRatingById = async (req, resp) => {
    try {
        const ratingId = req.params.id;
        const data = await prisma_1.default.rating.findUnique({
            where: {
                id: ratingId,
            },
        });
        if (!data) {
            resp.status(404).json({
                message: "Rating not found",
            });
            return;
        }
        resp.status(200).json({
            data,
            message: "Rating Information Successfully Found",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Rating Info Not Found",
        });
        return;
    }
};
exports.getRatingById = getRatingById;
const updateRatingById = async (req, resp) => {
    try {
        const ratingId = req.params.id;
        const body = req.body;
        const existingRating = await prisma_1.default.rating.findUnique({
            where: {
                id: ratingId,
            },
        });
        if (!existingRating) {
            resp.status(404).json({
                message: "Rating Not Found",
            });
            return;
        }
        const updatedData = {
            ...body,
        };
        const rating = await prisma_1.default.rating.update({
            where: {
                id: ratingId,
            },
            data: updatedData,
        });
        resp.status(200).json({
            data: rating,
            message: "Rating Info Updated Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Rating Info Not Updated Successfully",
        });
        return;
    }
};
exports.updateRatingById = updateRatingById;
const deleteRatingById = async (req, resp) => {
    try {
        const ratingId = req.params.id;
        const existingRating = await prisma_1.default.rating.findUnique({
            where: {
                id: ratingId,
            },
        });
        if (!existingRating) {
            resp.status(404).json({
                message: "Rating Not Found",
            });
            return;
        }
        const rating = await prisma_1.default.rating.delete({
            where: {
                id: ratingId,
            },
        });
        resp.status(200).json({
            rating,
            message: "Rating deleted successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Rating Not Found",
        });
        return;
    }
};
exports.deleteRatingById = deleteRatingById;
