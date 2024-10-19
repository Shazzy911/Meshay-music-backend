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
exports.deletePlaylistSongById = exports.updatePlaylistSongById = exports.getPlaylistSongById = exports.createPlaylistSong = exports.getAllPlaylistSong = void 0;
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
// import { supabase } from "../lib/supabaseClient";
const getAllPlaylistSong = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let PlaylistSong = yield prisma_config_1.default.playlistSong.findMany();
        if (!PlaylistSong || PlaylistSong.length === 0) {
            resp.status(404).json({ message: "PlaylistSong not Found" });
        }
        resp.status(200).json(PlaylistSong);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
});
exports.getAllPlaylistSong = getAllPlaylistSong;
const createPlaylistSong = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { playlistId, songId } = req.body;
        if (!playlistId || !songId) {
            resp.status(404).json({ message: "All fields are required" });
        }
        // Upload the image to a specific folder in your Supabase storage bucket
        // const { data: storageData, error: storageError } = await supabase.storage
        //   .from("music-store")
        //   .upload(`PlaylistSong/${file.originalname}`, file.buffer, {
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
        const data = yield prisma_config_1.default.playlistSong.create({
            data: {
                playlistId,
                songId,
            },
        });
        resp.status(201).json({
            result: data,
            message: "PlaylistSong Information Saved Successfully",
        });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
});
exports.createPlaylistSong = createPlaylistSong;
/// PlaylistSong By Id.
const getPlaylistSongById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PlaylistSongId = req.params.id;
        let data = yield prisma_config_1.default.playlistSong.findUnique({
            where: {
                id: PlaylistSongId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "PlaylistSong not found" });
        }
        else {
            resp.status(200).json({
                data: data,
                message: "PlaylistSong Infomation Successfully Found",
            });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "PlaylistSong Info Not Updated Successfully" });
    }
});
exports.getPlaylistSongById = getPlaylistSongById;
const updatePlaylistSongById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PlaylistSongId = req.params.id;
        const body = req.body;
        const existingPlaylistSong = yield prisma_config_1.default.playlistSong.findUnique({
            where: {
                id: PlaylistSongId,
            },
        });
        if (!existingPlaylistSong) {
            resp.status(404).json({ message: "PlaylistSong Not Found" });
        }
        let updatedData = Object.assign({}, body);
        // let data = await PlaylistSong.updateOne({ PlaylistSongId }, updatePlaylistSong);
        const PlaylistSong = yield prisma_config_1.default.playlistSong.update({
            where: { id: PlaylistSongId },
            data: updatedData,
        });
        resp.status(200).json({
            data: PlaylistSong,
            message: "PlaylistSong Info Updated Successfully",
        });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "PlaylistSong Info Not Updated Successfully" });
    }
});
exports.updatePlaylistSongById = updatePlaylistSongById;
const deletePlaylistSongById = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PlaylistSongId = req.params.id;
        const existingPlaylistSong = yield prisma_config_1.default.playlistSong.findUnique({
            where: {
                id: PlaylistSongId,
            },
        });
        if (!existingPlaylistSong) {
            resp.status(404).json({ message: "PlaylistSong Not Found" });
        }
        const PlaylistSong = yield prisma_config_1.default.playlistSong.delete({
            where: { id: PlaylistSongId },
        });
        resp
            .status(200)
            .json({ PlaylistSong, message: "PlaylistSong deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "PlaylistSong Not Found" });
    }
});
exports.deletePlaylistSongById = deletePlaylistSongById;