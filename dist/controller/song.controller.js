"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSongById = exports.updateSongById = exports.getSongById = exports.createSong = exports.getAllSong = void 0;
const base64_arraybuffer_1 = require("base64-arraybuffer");
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
const supabaseClient_1 = __importDefault(require("../lib/supabaseClient"));
const getAllSong = async (req, resp) => {
    try {
        let Song = await prisma_config_1.default.song.findMany();
        if (!Song || Song.length === 0) {
            resp.status(404).json({ message: "Song not Found" });
        }
        resp.status(200).json(Song);
    }
    catch (error) {
        resp.status(500).json({ error });
    }
};
exports.getAllSong = getAllSong;
const createSong = async (req, resp) => {
    try {
        const { artistId, albumId, title, duration, genre, releaseDate } = req.body;
        if (!title ||
            !duration ||
            !genre ||
            !releaseDate ||
            !artistId ||
            !albumId) {
            resp.status(404).json({ message: "All fields are required" });
        }
        console.log(typeof duration);
        let Numduration = Number(req.body.duration);
        console.log(typeof Numduration);
        console.log(artistId, albumId, title, duration, genre, releaseDate);
        const file = req.files;
        const imageFile = file["img"][0];
        const songFile = file["songUrl"][0];
        // If we reach here, we have both files safely
        console.log("Image File:", imageFile.originalname);
        console.log("Song File:", songFile.originalname);
        // decode file buffer to base64
        const imgFileBase64 = (0, base64_arraybuffer_1.decode)(imageFile.buffer.toString("base64"));
        const songFileBase64 = (0, base64_arraybuffer_1.decode)(songFile.buffer.toString("base64"));
        // Convert releaseDate to ISO string format (with milliseconds and Z for UTC)
        const isoReleaseDate = new Date(releaseDate).toISOString();
        // upload the imageFile to supabase
        const { data: imageUpload, error: imageError } = await supabaseClient_1.default.storage
            .from("music-store")
            .upload("images/song/" + imageFile.originalname, imgFileBase64, {
            contentType: imageFile.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        // upload the imageFile to supabase
        const { data: songUpload, error: songError } = await supabaseClient_1.default.storage
            .from("music-store")
            .upload("audio/" + songFile.originalname, songFileBase64, {
            contentType: songFile.mimetype,
            cacheControl: "3600",
            upsert: false,
        });
        // Handle storage upload errors
        if (imageError || songError) {
            const errorMessage = imageError ? "image" : "song";
            resp.status(404).json({
                message: `Error uploading ${errorMessage} to Supabase`,
                error: imageError?.message || songError?.message,
            });
        }
        // Check if imageUpload is not null
        if (songUpload !== null && imageUpload !== null) {
            const imageUrl = supabaseClient_1.default.storage
                .from("music-store")
                .getPublicUrl(imageUpload.path);
            const songUrl = supabaseClient_1.default.storage
                .from("music-store")
                .getPublicUrl(songUpload.path);
            const songData = await prisma_config_1.default.song.create({
                data: {
                    artistId,
                    albumId,
                    title,
                    duration: Numduration,
                    genre,
                    releaseDate: isoReleaseDate,
                    img: imageUrl?.data?.publicUrl || "",
                    songUrl: songUrl?.data?.publicUrl || "",
                },
            });
            resp.status(201).json({
                success: true,
                result: songData,
                message: "Song Information Saved Successfully",
            });
        }
        else {
            // Handle the case where storageData is null
            resp.status(404).json({
                message: "Error uploading file, Song data is null",
            });
        }
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Song Information" });
    }
};
exports.createSong = createSong;
/// Song By Id.
const getSongById = async (req, resp) => {
    try {
        const SongId = req.params.id;
        let data = await prisma_config_1.default.song.findUnique({
            where: {
                id: SongId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "Song not found" });
        }
        else {
            resp
                .status(200)
                .json({ data: data, message: "Song Infomation Successfully Found" });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Song Info Not Updated Successfully" });
    }
};
exports.getSongById = getSongById;
const updateSongById = async (req, resp) => {
    try {
        const SongId = req.params.id;
        const body = req.body;
        const existingSong = await prisma_config_1.default.song.findUnique({
            where: {
                id: SongId,
            },
        });
        if (!existingSong) {
            resp.status(404).json({ message: "Song Not Found" });
        }
        let updatedData = {
            ...body,
        };
        // let data = await Song.updateOne({ SongId }, updateSong);
        const Song = await prisma_config_1.default.song.update({
            where: { id: SongId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: Song, message: "Song Info Updated Successfully" });
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "Song Info Not Updated Successfully" });
    }
};
exports.updateSongById = updateSongById;
const deleteSongById = async (req, resp) => {
    try {
        const SongId = req.params.id;
        const existingSong = await prisma_config_1.default.song.findUnique({
            where: {
                id: SongId,
            },
        });
        if (!existingSong) {
            resp.status(404).json({ message: "Song Not Found" });
        }
        const Song = await prisma_config_1.default.song.delete({
            where: { id: SongId },
        });
        resp.status(200).json({ Song, message: "Song deleted successfully" });
    }
    catch (error) {
        resp.status(500).json({ error, message: "Song Not Found" });
    }
};
exports.deleteSongById = deleteSongById;
// {
//   "artistId": "cm29dgzp1001y3uneq03diuj1",
//   "albumId": "cm29dhzb000203unelhxwrjus",
//   "title": "Telus Jesus Freak",
//   "duration": 205,
//   "img": "http://example.com",
//   "genre": "Pop",
//   "songUrl": "http://song.com",
//   "releaseDate": "2021-03-20T00:00:00Z"
// }
