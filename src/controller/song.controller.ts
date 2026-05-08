import { Request, Response } from "../types/file.type";
import { decode } from "base64-arraybuffer";
import prisma from "../lib/prisma";
import { IFile } from "../types/file.type";
import supabase from "../lib/supabaseClient";

type IMulterFiles = {
  [fieldname: string]: IFile[];
};

/* =========================
   GET ALL SONGS
========================= */
const getAllSong = async (req: Request, resp: Response): Promise<void> => {
  try {
    const songs = await prisma.song.findMany();

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
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   CREATE SONG
========================= */
const createSong = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { artistId, albumId, title, duration, genre, releaseDate } = req.body;

    // Validate fields
    if (
      !artistId ||
      !albumId ||
      !title ||
      !duration ||
      !genre ||
      !releaseDate
    ) {
      resp.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const numDuration = Number(duration);

    const files = req.files as IMulterFiles;

    if (
      !files ||
      !files.img ||
      !files.songUrl ||
      files.img.length === 0 ||
      files.songUrl.length === 0
    ) {
      resp.status(400).json({
        success: false,
        message: "Image and audio files are required",
      });
      return;
    }

    const imageFile = files.img[0];
    const songFile = files.songUrl[0];

    const imageBase64 = decode(imageFile.buffer.toString("base64"));
    const songBase64 = decode(songFile.buffer.toString("base64"));

    const isoReleaseDate = new Date(releaseDate).toISOString();

    // Unique file names (IMPORTANT FIX)
    const imageName = `${Date.now()}-${imageFile.originalname}`;
    const songName = `${Date.now()}-${songFile.originalname}`;

    // Upload image
    const { data: imageUpload, error: imageError } = await supabase.storage
      .from("music-store")
      .upload(`images/song/${imageName}`, imageBase64, {
        contentType: imageFile.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    // Upload song
    const { data: songUpload, error: songError } = await supabase.storage
      .from("music-store")
      .upload(`audio/${songName}`, songBase64, {
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
    const imageUrl = supabase.storage
      .from("music-store")
      .getPublicUrl(imageUpload.path);

    const songUrl = supabase.storage
      .from("music-store")
      .getPublicUrl(songUpload.path);

    // Save to DB
    const song = await prisma.song.create({
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
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Error creating song",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   GET SONG BY ID
========================= */
const getSongById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const songId = req.params.id;

    if (!songId) {
      resp.status(400).json({
        success: false,
        message: "Song ID is required",
      });
      return;
    }

    const song = await prisma.song.findUnique({
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
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   UPDATE SONG
========================= */
const updateSongById = async (req: Request, resp: Response): Promise<void> => {
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

    const existingSong = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!existingSong) {
      resp.status(404).json({
        success: false,
        message: "Song not found",
      });
      return;
    }

    const updatedSong = await prisma.song.update({
      where: { id: songId },
      data: { ...body },
    });

    resp.status(200).json({
      success: true,
      data: updatedSong,
      message: "Song updated successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   DELETE SONG
========================= */
const deleteSongById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const songId = req.params.id;

    if (!songId) {
      resp.status(400).json({
        success: false,
        message: "Song ID is required",
      });
      return;
    }

    const existingSong = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!existingSong) {
      resp.status(404).json({
        success: false,
        message: "Song not found",
      });
      return;
    }

    const song = await prisma.song.delete({
      where: { id: songId },
    });

    resp.status(200).json({
      success: true,
      data: song,
      message: "Song deleted successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { getAllSong, createSong, getSongById, updateSongById, deleteSongById };
