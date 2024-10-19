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
exports.deleteAlbumById = exports.updateAlbumById = exports.getAlbumById = exports.createAlbum = exports.getAllAlbum = void 0;
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
const supabaseClient_1 = __importDefault(require("../lib/supabaseClient"));
const base64_arraybuffer_1 = require("base64-arraybuffer");
// import { supabase } from "../lib/supabaseClient";
const getAllAlbum = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Album = yield prisma_config_1.default.album.findMany();
        if (!Album || Album.length === 0) {
            resp.status(404).json({ message: "Album not Found" });
        }
        resp.status(200).json(Album);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
});
exports.getAllAlbum = getAllAlbum;
const createAlbum = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, genre, releaseDate, artistId } = req.body;
        console.warn(title, genre, releaseDate, artistId);
        if (!artistId || !title || !genre || !releaseDate) {
            resp.status(404).json({ message: "All fields are required" });
        }
        const isoReleaseDate = new Date(releaseDate).toISOString();
        const file = req.file;
        console.log(file);
        if (!file) {
            resp.status(400).json({ message: "File is missing... not uploaded" });
        }
        // decode file buffer to base64
        const fileBase64 = (0, base64_arraybuffer_1.decode)(file.buffer.toString("base64"));
        // upload the file to supabase
        const { data: storageData, error: storageError } = yield supabaseClient_1.default.storage
            .from("music-store")
            .upload("images/album/" + file.originalname, fileBase64, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        // Handle storage upload errors
        if (storageError) {
            resp.status(500).json({
                message: "Error uploading image to Supabase",
                error: storageError.message,
            });
        }
        // get public url of the uploaded file
        // Check if storageData is not null
        if (storageData !== null) {
            const imageData = supabaseClient_1.default.storage
                .from("music-store")
                .getPublicUrl(storageData.path);
            const data = yield prisma_config_1.default.album.create({
                data: {
                    artistId,
                    title,
                    genre,
                    img: ((_a = imageData === null || imageData === void 0 ? void 0 : imageData.data) === null || _a === void 0 ? void 0 : _a.publicUrl) || "",
                    releaseDate: isoReleaseDate,
                },
            });
            resp.status(201).json({
                success: true,
                result: data,
                message: "Album Information Saved Successfully",
            });
        }
        else {
            // Handle the case where storageData is null
            resp.status(500).json({
                message: "Error uploading file, storage data is null",
            });
        }
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
});
exports.createAlbum = createAlbum;
/// Album By Id.
const getAlbumById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AlbumId = req.params.id;
        let data = yield prisma_config_1.default.album.findUnique({
            where: {
                id: AlbumId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Album not found" });
        }
        else {
            resp
                .status(200)
                .json({ data: data, message: "Album Infomation Successfully Found" });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Album Info Not Updated Successfully" });
    }
});
exports.getAlbumById = getAlbumById;
const updateAlbumById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AlbumId = req.params.id;
        const body = req.body;
        const existingAlbum = yield prisma_config_1.default.album.findUnique({
            where: {
                id: AlbumId,
            },
        });
        if (!existingAlbum) {
            resp.status(404).json({ message: "Album Not Found" });
        }
        let updatedData = Object.assign({}, body);
        // let data = await Album.updateOne({ AlbumId }, updateAlbum);
        const Album = yield prisma_config_1.default.album.update({
            where: { id: AlbumId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: Album, message: "Album Info Updated Successfully" });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Album Info Not Updated Successfully" });
    }
});
exports.updateAlbumById = updateAlbumById;
const deleteAlbumById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AlbumId = req.params.id;
        const existingAlbum = yield prisma_config_1.default.album.findUnique({
            where: {
                id: AlbumId,
            },
        });
        if (!existingAlbum) {
            resp.status(404).json({ message: "Album Not Found" });
        }
        const Album = yield prisma_config_1.default.album.delete({
            where: { id: AlbumId },
        });
        resp.status(200).json({ Album, message: "Album deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Album Not Found" });
    }
});
exports.deleteAlbumById = deleteAlbumById;
