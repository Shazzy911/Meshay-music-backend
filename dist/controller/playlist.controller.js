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
exports.deletePlaylistById = exports.updatePlaylistById = exports.getPlaylistById = exports.createPlaylist = exports.getAllPlaylist = void 0;
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
// import { supabase } from "../lib/supabaseClient";
const getAllPlaylist = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Playlist = yield prisma_config_1.default.playlist.findMany();
        if (!Playlist || Playlist.length === 0) {
            resp.status(404).json({ message: "Playlist not Found" });
        }
        resp.status(200).json(Playlist);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
});
exports.getAllPlaylist = getAllPlaylist;
const createPlaylist = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, userId, description } = req.body;
        if (!title || !description || !userId) {
            resp.status(404).json({ message: "All fields are required" });
        }
        // Upload the image to a specific folder in your Supabase storage bucket
        // const { data: storageData, error: storageError } = await supabase.storage
        //   .from("music-store")
        //   .upload(`Playlist/${file.originalname}`, file.buffer, {
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
        const data = yield prisma_config_1.default.playlist.create({
            data: {
                userId,
                title,
                description,
            },
        });
        resp.status(201).json({
            result: data,
            message: "Playlist Information Saved Successfully",
        });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
});
exports.createPlaylist = createPlaylist;
/// Playlist By Id.
const getPlaylistById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PlaylistId = req.params.id;
        let data = yield prisma_config_1.default.playlist.findUnique({
            where: {
                id: PlaylistId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Playlist not found" });
        }
        else {
            resp.status(200).json({
                data: data,
                message: "Playlist Infomation Successfully Found",
            });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Playlist Info Not Updated Successfully" });
    }
});
exports.getPlaylistById = getPlaylistById;
const updatePlaylistById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PlaylistId = req.params.id;
        const body = req.body;
        const existingPlaylist = yield prisma_config_1.default.playlist.findUnique({
            where: {
                id: PlaylistId,
            },
        });
        if (!existingPlaylist) {
            resp.status(404).json({ message: "Playlist Not Found" });
        }
        let updatedData = Object.assign({}, body);
        // let data = await Playlist.updateOne({ PlaylistId }, updatePlaylist);
        const Playlist = yield prisma_config_1.default.playlist.update({
            where: { id: PlaylistId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: Playlist, message: "Playlist Info Updated Successfully" });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Playlist Info Not Updated Successfully" });
    }
});
exports.updatePlaylistById = updatePlaylistById;
const deletePlaylistById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PlaylistId = req.params.id;
        const existingPlaylist = yield prisma_config_1.default.playlist.findUnique({
            where: {
                id: PlaylistId,
            },
        });
        if (!existingPlaylist) {
            resp.status(404).json({ message: "Playlist Not Found" });
        }
        const Playlist = yield prisma_config_1.default.playlist.delete({
            where: { id: PlaylistId },
        });
        resp
            .status(200)
            .json({ Playlist, message: "Playlist deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Playlist Not Found" });
    }
});
exports.deletePlaylistById = deletePlaylistById;
