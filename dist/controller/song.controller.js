"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSongById = exports.updateSongById = exports.getSongById = exports.createSong = exports.getAllSong = void 0;
const base64_arraybuffer_1 = require("base64-arraybuffer");
const prisma_1 = __importDefault(require("../lib/prisma"));
const supabaseClient_1 = __importDefault(require("../lib/supabaseClient"));
/* =========================
   GET ALL SONGS
========================= */
const getAllSong = async (req, resp) => {
    try {
        const songs = await prisma_1.default.song.findMany({
            select: {
                id: true,
                artistId: true,
                albumId: true,
                title: true,
                duration: true,
                img: true,
                genre: true,
                songUrl: true,
                releaseDate: true,
                isExplicit: true,
                playCount: true,
                likes: true,
            },
        });
        if (songs.length === 0) {
            resp.status(404).json({
                success: false,
                data: [],
                message: "No songs found",
            });
            return;
        }
        resp.status(200).json({
            success: true,
            data: songs,
            message: "Songs fetched successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAllSong = getAllSong;
/* =========================
   CREATE SONG
========================= */
const createSong = async (req, resp) => {
    try {
        const { artistId, albumId, title, duration, genre, releaseDate } = req.body;
        // Validate fields
        if (!artistId ||
            !albumId ||
            !title ||
            !duration ||
            !genre ||
            !releaseDate) {
            resp.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const numDuration = Number(duration);
        const files = req.files;
        if (!files ||
            !files.img ||
            !files.songUrl ||
            files.img.length === 0 ||
            files.songUrl.length === 0) {
            resp.status(400).json({
                success: false,
                message: "Image and audio files are required",
            });
            return;
        }
        const imageFile = files.img[0];
        const songFile = files.songUrl[0];
        const imageBase64 = (0, base64_arraybuffer_1.decode)(imageFile.buffer.toString("base64"));
        const songBase64 = (0, base64_arraybuffer_1.decode)(songFile.buffer.toString("base64"));
        const isoReleaseDate = new Date(releaseDate).toISOString();
        // Unique file names (IMPORTANT FIX)
        const imageName = `${Date.now()}-${imageFile.originalname}`;
        const songName = `${Date.now()}-${songFile.originalname}`;
        // Upload image
        const { data: imageUpload, error: imageError } = await supabaseClient_1.default.storage
            .from("music-store")
            .upload(`images/song/${artistId}/${albumId}/${imageName}`, imageBase64, {
            contentType: imageFile.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        // Upload song
        const { data: songUpload, error: songError } = await supabaseClient_1.default.storage
            .from("music-store")
            .upload(`audio/${artistId}/${albumId}/${songName}`, songBase64, {
            contentType: songFile.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        // Handle upload errors
        if (imageError || songError) {
            resp.status(500).json({
                success: false,
                message: "Error uploading files to Supabase",
                error: imageError?.message || songError?.message,
            });
            return;
        }
        if (!imageUpload || !songUpload) {
            resp.status(500).json({
                success: false,
                message: "Upload failed, no data returned",
            });
            return;
        }
        // Get public URLs
        const imageUrl = supabaseClient_1.default.storage
            .from("music-store")
            .getPublicUrl(imageUpload.path);
        const songUrl = supabaseClient_1.default.storage
            .from("music-store")
            .getPublicUrl(songUpload.path);
        // Save to DB
        const song = await prisma_1.default.song.create({
            data: {
                artistId,
                albumId,
                title,
                duration: numDuration,
                genre,
                releaseDate: isoReleaseDate,
                img: imageUrl.data.publicUrl,
                songUrl: songUrl.data.publicUrl,
            },
        });
        resp.status(201).json({
            success: true,
            data: song,
            message: "Song created successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Error creating song",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createSong = createSong;
/* =========================
   GET SONG BY ID
========================= */
const getSongById = async (req, resp) => {
    try {
        const songId = req.params.id;
        if (!songId) {
            resp.status(400).json({
                success: false,
                message: "Song ID is required",
            });
            return;
        }
        const song = await prisma_1.default.song.findUnique({
            where: { id: songId },
        });
        if (!song) {
            resp.status(404).json({
                success: false,
                data: null,
                message: "Song not found",
            });
            return;
        }
        resp.status(200).json({
            success: true,
            data: song,
            message: "Song fetched successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getSongById = getSongById;
/* =========================
   UPDATE SONG
========================= */
const updateSongById = async (req, resp) => {
    try {
        const songId = req.params.id;
        const body = req.body;
        if (!songId) {
            resp.status(400).json({
                success: false,
                message: "Song ID is required",
            });
            return;
        }
        const existingSong = await prisma_1.default.song.findUnique({
            where: { id: songId },
        });
        if (!existingSong) {
            resp.status(404).json({
                success: false,
                message: "Song not found",
            });
            return;
        }
        const updatedSong = await prisma_1.default.song.update({
            where: { id: songId },
            data: { ...body },
        });
        resp.status(200).json({
            success: true,
            data: updatedSong,
            message: "Song updated successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateSongById = updateSongById;
/* =========================
   DELETE SONG
========================= */
const deleteSongById = async (req, resp) => {
    try {
        const songId = req.params.id;
        if (!songId) {
            resp.status(400).json({
                success: false,
                message: "Song ID is required",
            });
            return;
        }
        const existingSong = await prisma_1.default.song.findUnique({
            where: { id: songId },
        });
        if (!existingSong) {
            resp.status(404).json({
                success: false,
                message: "Song not found",
            });
            return;
        }
        const song = await prisma_1.default.song.delete({
            where: { id: songId },
        });
        resp.status(200).json({
            success: true,
            data: song,
            message: "Song deleted successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteSongById = deleteSongById;
