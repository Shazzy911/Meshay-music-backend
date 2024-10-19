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
exports.deleteRatingById = exports.updateRatingById = exports.getRatingById = exports.createRating = exports.getAllRating = void 0;
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
// import { supabase } from "../lib/supabaseClient";
const getAllRating = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Rating = yield prisma_config_1.default.rating.findMany();
        if (!Rating || Rating.length === 0) {
            resp.status(404).json({ message: "Rating not Found" });
        }
        resp.status(200).json(Rating);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
});
exports.getAllRating = getAllRating;
const createRating = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, userId, songId } = req.body;
        if (!rating || !songId || !userId) {
            resp.status(404).json({ message: "All fields are required" });
        }
        // Upload the image to a specific folder in your Supabase storage bucket
        // const { data: storageData, error: storageError } = await supabase.storage
        //   .from("music-store")
        //   .upload(`Rating/${file.originalname}`, file.buffer, {
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
        const data = yield prisma_config_1.default.rating.create({
            data: {
                userId,
                songId,
                rating,
            },
        });
        resp
            .status(201)
            .json({ result: data, message: "Rating Information Saved Successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
});
exports.createRating = createRating;
/// Rating By Id.
const getRatingById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const RatingId = req.params.id;
        let data = yield prisma_config_1.default.rating.findUnique({
            where: {
                id: RatingId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Rating not found" });
        }
        else {
            resp
                .status(200)
                .json({ data: data, message: "Rating Infomation Successfully Found" });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Rating Info Not Updated Successfully" });
    }
});
exports.getRatingById = getRatingById;
const updateRatingById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const RatingId = req.params.id;
        const body = req.body;
        const existingRating = yield prisma_config_1.default.rating.findUnique({
            where: {
                id: RatingId,
            },
        });
        if (!existingRating) {
            resp.status(404).json({ message: "Rating Not Found" });
        }
        let updatedData = Object.assign({}, body);
        // let data = await Rating.updateOne({ RatingId }, updateRating);
        const Rating = yield prisma_config_1.default.rating.update({
            where: { id: RatingId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: Rating, message: "Rating Info Updated Successfully" });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Rating Info Not Updated Successfully" });
    }
});
exports.updateRatingById = updateRatingById;
const deleteRatingById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const RatingId = req.params.id;
        const existingRating = yield prisma_config_1.default.rating.findUnique({
            where: {
                id: RatingId,
            },
        });
        if (!existingRating) {
            resp.status(404).json({ message: "Rating Not Found" });
        }
        const Rating = yield prisma_config_1.default.rating.delete({
            where: { id: RatingId },
        });
        resp.status(200).json({ Rating, message: "Rating deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Rating Not Found" });
    }
});
exports.deleteRatingById = deleteRatingById;
