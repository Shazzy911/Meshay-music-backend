"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaylistSongById = exports.updatePlaylistSongById = exports.getPlaylistSongById = exports.createPlaylistSong = exports.getAllPlaylistSong = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllPlaylistSong = async (req, resp) => {
    try {
        const playlistSong = await prisma_1.default.playlistSong.findMany();
        if (!playlistSong || playlistSong.length === 0) {
            resp.status(404).json({
                message: "PlaylistSong not Found",
            });
            return;
        }
        resp.status(200).json({
            data: playlistSong,
            message: "PlaylistSongs fetched successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({ error });
        return;
    }
};
exports.getAllPlaylistSong = getAllPlaylistSong;
const createPlaylistSong = async (req, resp) => {
    try {
        const { playlistId, songId } = req.body;
        if (!playlistId || !songId) {
            resp.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const data = await prisma_1.default.playlistSong.create({
            data: {
                playlistId,
                songId,
            },
        });
        resp.status(201).json({
            success: true,
            result: data,
            message: "PlaylistSong Information Saved Successfully",
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
exports.createPlaylistSong = createPlaylistSong;
const getPlaylistSongById = async (req, resp) => {
    try {
        const playlistSongId = req.params.id;
        const data = await prisma_1.default.playlistSong.findUnique({
            where: {
                id: playlistSongId,
            },
        });
        if (!data) {
            resp.status(404).json({
                message: "PlaylistSong not found",
            });
            return;
        }
        resp.status(200).json({
            data,
            message: "PlaylistSong Information Successfully Found",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "PlaylistSong Info Not Found",
        });
        return;
    }
};
exports.getPlaylistSongById = getPlaylistSongById;
const updatePlaylistSongById = async (req, resp) => {
    try {
        const playlistSongId = req.params.id;
        const body = req.body;
        const existingPlaylistSong = await prisma_1.default.playlistSong.findUnique({
            where: {
                id: playlistSongId,
            },
        });
        if (!existingPlaylistSong) {
            resp.status(404).json({
                message: "PlaylistSong Not Found",
            });
            return;
        }
        const updatedData = {
            ...body,
        };
        const playlistSong = await prisma_1.default.playlistSong.update({
            where: {
                id: playlistSongId,
            },
            data: updatedData,
        });
        resp.status(200).json({
            data: playlistSong,
            message: "PlaylistSong Info Updated Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "PlaylistSong Info Not Updated Successfully",
        });
        return;
    }
};
exports.updatePlaylistSongById = updatePlaylistSongById;
const deletePlaylistSongById = async (req, resp) => {
    try {
        const playlistSongId = req.params.id;
        const existingPlaylistSong = await prisma_1.default.playlistSong.findUnique({
            where: {
                id: playlistSongId,
            },
        });
        if (!existingPlaylistSong) {
            resp.status(404).json({
                message: "PlaylistSong Not Found",
            });
            return;
        }
        const playlistSong = await prisma_1.default.playlistSong.delete({
            where: {
                id: playlistSongId,
            },
        });
        resp.status(200).json({
            playlistSong,
            message: "PlaylistSong deleted successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "PlaylistSong Not Found",
        });
        return;
    }
};
exports.deletePlaylistSongById = deletePlaylistSongById;
