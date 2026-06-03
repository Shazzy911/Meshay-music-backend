"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaylistById = exports.updatePlaylistById = exports.getPlaylistById = exports.createPlaylist = exports.getAllPlaylist = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllPlaylist = async (req, resp) => {
    try {
        const playlist = await prisma_1.default.playlist.findMany();
        if (!playlist || playlist.length === 0) {
            resp.status(404).json({
                message: "Playlist not Found",
            });
            return;
        }
        resp.status(200).json({
            data: playlist,
            message: "Playlists fetched successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({ error });
        return;
    }
};
exports.getAllPlaylist = getAllPlaylist;
const createPlaylist = async (req, resp) => {
    try {
        const { title, userId, description } = req.body;
        if (!title || !description || !userId) {
            resp.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const data = await prisma_1.default.playlist.create({
            data: {
                userId,
                title,
                description,
            },
        });
        resp.status(201).json({
            success: true,
            result: data,
            message: "Playlist Information Saved Successfully",
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
exports.createPlaylist = createPlaylist;
const getPlaylistById = async (req, resp) => {
    try {
        const playlistId = req.params.id;
        const data = await prisma_1.default.playlist.findUnique({
            where: {
                id: playlistId,
            },
        });
        if (!data) {
            resp.status(404).json({
                message: "Playlist not found",
            });
            return;
        }
        resp.status(200).json({
            data,
            message: "Playlist Information Successfully Found",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Playlist Info Not Found",
        });
        return;
    }
};
exports.getPlaylistById = getPlaylistById;
const updatePlaylistById = async (req, resp) => {
    try {
        const playlistId = req.params.id;
        const body = req.body;
        const existingPlaylist = await prisma_1.default.playlist.findUnique({
            where: {
                id: playlistId,
            },
        });
        if (!existingPlaylist) {
            resp.status(404).json({
                message: "Playlist Not Found",
            });
            return;
        }
        const updatedData = {
            ...body,
        };
        const playlist = await prisma_1.default.playlist.update({
            where: {
                id: playlistId,
            },
            data: updatedData,
        });
        resp.status(200).json({
            data: playlist,
            message: "Playlist Info Updated Successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Playlist Info Not Updated Successfully",
        });
        return;
    }
};
exports.updatePlaylistById = updatePlaylistById;
const deletePlaylistById = async (req, resp) => {
    try {
        const playlistId = req.params.id;
        const existingPlaylist = await prisma_1.default.playlist.findUnique({
            where: {
                id: playlistId,
            },
        });
        if (!existingPlaylist) {
            resp.status(404).json({
                message: "Playlist Not Found",
            });
            return;
        }
        const playlist = await prisma_1.default.playlist.delete({
            where: {
                id: playlistId,
            },
        });
        resp.status(200).json({
            playlist,
            message: "Playlist deleted successfully",
        });
        return;
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Playlist Not Found",
        });
        return;
    }
};
exports.deletePlaylistById = deletePlaylistById;
