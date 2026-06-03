"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtistById = exports.updateArtistById = exports.getArtistById = exports.createArtist = exports.getAllArtist = void 0;
// import { decode } from "base64-arraybuffer";
const prisma_1 = __importDefault(require("../lib/prisma"));
const supabaseClient_1 = __importDefault(require("../lib/supabaseClient"));
/* =========================
   GET ALL ARTISTS
========================= */
const getAllArtist = async (req, resp) => {
    try {
        const artists = await prisma_1.default.artist.findMany();
        if (artists.length === 0) {
            resp.status(404).json({
                success: false,
                data: [],
                message: "No artists found",
            });
            return;
        }
        resp.status(200).json({
            success: true,
            data: artists,
            message: "Artists fetched successfully",
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
exports.getAllArtist = getAllArtist;
/* =========================
   CREATE ARTIST
========================= */
const createArtist = async (req, resp) => {
    try {
        const { name, genre, bio } = req.body;
        if (!name || !genre || !bio) {
            resp.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const file = req.file;
        if (!file) {
            resp.status(400).json({
                success: false,
                message: "Image file is required",
            });
            return;
        }
        // const fileBase64 = decode(file.buffer.toString("base64"));
        const fileBuffer = file.buffer;
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data: storageData, error: storageError } = await supabaseClient_1.default.storage
            .from("music-store")
            .upload(`images/artist/${name}/${fileName}`, fileBuffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        if (storageError) {
            resp.status(500).json({
                success: false,
                message: "Error uploading image to Supabase",
                error: storageError.message,
            });
            return;
        }
        if (!storageData) {
            resp.status(500).json({
                success: false,
                message: "Upload failed, no storage data returned",
            });
            return;
        }
        const imageUrl = supabaseClient_1.default.storage
            .from("music-store")
            .getPublicUrl(storageData.path);
        const artist = await prisma_1.default.artist.create({
            data: {
                name,
                genre,
                bio,
                img: imageUrl.data.publicUrl,
            },
        });
        resp.status(201).json({
            success: true,
            data: artist,
            message: "Artist created successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Error creating artist",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createArtist = createArtist;
/* =========================
   GET ARTIST BY ID
========================= */
const getArtistById = async (req, resp) => {
    try {
        const artistId = req.params.id;
        if (!artistId) {
            resp.status(400).json({
                success: false,
                message: "Artist ID is required",
            });
            return;
        }
        const artist = await prisma_1.default.artist.findUnique({
            where: {
                id: artistId,
            },
            select: {
                id: true,
                name: true,
                genre: true,
                bio: true,
                img: true,
                songs: {
                    select: {
                        id: true,
                        title: true,
                        duration: true,
                        img: true,
                        genre: true,
                        songUrl: true,
                        releaseDate: true,
                        isExplicit: true,
                        playCount: true,
                        likes: true,
                        // ✅ THIS IS THE KEY FIX
                        album: {
                            select: {
                                id: true,
                                title: true,
                                img: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                _count: {
                    select: {
                        songs: true,
                    },
                },
            },
        });
        if (!artist) {
            resp.status(404).json({
                success: false,
                data: null,
                message: "Artist not found",
            });
            return;
        }
        resp.status(200).json({
            success: true,
            data: artist,
            message: "Artist fetched successfully",
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
exports.getArtistById = getArtistById;
/* =========================
   UPDATE ARTIST
========================= */
const updateArtistById = async (req, resp) => {
    try {
        const artistId = req.params.id;
        const body = req.body;
        if (!artistId) {
            resp.status(400).json({
                success: false,
                message: "Artist ID is required",
            });
            return;
        }
        const existingArtist = await prisma_1.default.artist.findUnique({
            where: { id: artistId },
        });
        if (!existingArtist) {
            resp.status(404).json({
                success: false,
                data: null,
                message: "Artist not found",
            });
            return;
        }
        const updatedArtist = await prisma_1.default.artist.update({
            where: { id: artistId },
            data: { ...body },
        });
        resp.status(200).json({
            success: true,
            data: updatedArtist,
            message: "Artist updated successfully",
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
exports.updateArtistById = updateArtistById;
/* =========================
   DELETE ARTIST
========================= */
const deleteArtistById = async (req, resp) => {
    try {
        const artistId = req.params.id;
        if (!artistId) {
            resp.status(400).json({
                success: false,
                message: "Artist ID is required",
            });
            return;
        }
        const existingArtist = await prisma_1.default.artist.findUnique({
            where: { id: artistId },
        });
        if (!existingArtist) {
            resp.status(404).json({
                success: false,
                data: null,
                message: "Artist not found",
            });
            return;
        }
        const deletedArtist = await prisma_1.default.artist.delete({
            where: { id: artistId },
        });
        resp.status(200).json({
            success: true,
            data: deletedArtist,
            message: "Artist deleted successfully",
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
exports.deleteArtistById = deleteArtistById;
