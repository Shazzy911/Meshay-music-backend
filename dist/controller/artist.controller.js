"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArtistById = exports.updateArtistById = exports.getArtistById = exports.createArtist = exports.getAllArtist = void 0;
const base64_arraybuffer_1 = require("base64-arraybuffer");
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
const supabaseClient_1 = __importDefault(require("../lib/supabaseClient"));
const getAllArtist = async (req, resp) => {
    try {
        let artist = await prisma_config_1.default.artist.findMany({
            include: {
                songs: true,
                albums: {
                    select: {
                        title: true,
                        genre: true,
                    },
                },
            },
        });
        if (!artist || artist.length === 0) {
            resp.status(404).json({ message: "Artist not Found" });
        }
        resp.status(200).json(artist);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
};
exports.getAllArtist = getAllArtist;
const createArtist = async (req, resp) => {
    // {file: File},
    try {
        const { name, genre, bio } = req.body;
        if (!name || !genre || !bio) {
            resp.status(404).json({ message: "All fields are required" });
        }
        const file = req.file;
        if (!file) {
            resp.status(400).json({ message: "File is missing... not uploaded" });
        }
        // decode file buffer to base64
        const fileBase64 = (0, base64_arraybuffer_1.decode)(file.buffer.toString("base64"));
        // upload the file to supabase
        const { data: storageData, error: storageError } = await supabaseClient_1.default.storage
            .from("music-store")
            .upload("images/artist/" + file.originalname, fileBase64, {
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
            const artistData = await prisma_config_1.default.artist.create({
                data: {
                    name,
                    genre,
                    bio,
                    img: imageData?.data?.publicUrl || "", // Use the public URL for the image,
                },
            });
            resp.status(201).json({
                success: true,
                result: artistData,
                message: "Artist Information Saved Successfully",
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
};
exports.createArtist = createArtist;
/// Artist By Id.
const getArtistById = async (req, resp) => {
    try {
        const ArtistId = req.params.id;
        let data = await prisma_config_1.default.artist.findUnique({
            where: {
                id: ArtistId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Artist not found" });
        }
        else {
            resp
                .status(200)
                .json({ data: data, message: "Artist Infomation Successfully Found" });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Artist Info Not Updated Successfully" });
    }
};
exports.getArtistById = getArtistById;
const updateArtistById = async (req, resp) => {
    try {
        const ArtistId = req.params.id;
        const body = req.body;
        const existingArtist = await prisma_config_1.default.artist.findUnique({
            where: {
                id: ArtistId,
            },
        });
        if (!existingArtist) {
            resp.status(404).json({ message: "Artist Not Found" });
        }
        let updatedData = {
            ...body,
        };
        // let data = await Artist.updateOne({ ArtistId }, updateArtist);
        const Artist = await prisma_config_1.default.artist.update({
            where: { id: ArtistId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: Artist, message: "Artist Info Updated Successfully" });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Artist Info Not Updated Successfully" });
    }
};
exports.updateArtistById = updateArtistById;
const deleteArtistById = async (req, resp) => {
    try {
        const ArtistId = req.params.id;
        const existingArtist = await prisma_config_1.default.artist.findUnique({
            where: {
                id: ArtistId,
            },
        });
        if (!existingArtist) {
            resp.status(404).json({ message: "Artist Not Found" });
        }
        const Artist = await prisma_config_1.default.artist.delete({
            where: { id: ArtistId },
        });
        resp.status(200).json({ Artist, message: "Artist deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Artist Not Found" });
    }
};
exports.deleteArtistById = deleteArtistById;
