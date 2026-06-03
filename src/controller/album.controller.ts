import { Request, Response } from "../types/file.type";
import prisma from "../lib/prisma";
import { IFile } from "../types/file.type";
import supabase from "../lib/supabaseClient";
import { decode } from "base64-arraybuffer";

const getAllAlbum = async (req: Request, resp: Response): Promise<void> => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        artist: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (albums.length === 0) {
      resp.status(404).json({
        success: false,
        data: [],
        message: "No albums found",
      });
      return;
    }

    resp.status(200).json({
      success: true,
      data: albums,
      message: "Albums fetched successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const createAlbum = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { title, genre, releaseDate, artistId } = req.body;

    // Validate fields
    if (!artistId || !title || !genre || !releaseDate) {
      resp.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Convert release date
    const isoReleaseDate = new Date(releaseDate).toISOString();

    // Get uploaded file
    const file = req.file as IFile;

    if (!file) {
      resp.status(400).json({
        success: false,
        message: "File is missing or not uploaded",
      });
      return;
    }

    // Convert file buffer
    const fileBase64 = decode(file.buffer.toString("base64"));

    // Generate unique file name
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload image to Supabase
    const { data: storageData, error: storageError } = await supabase.storage
      .from("music-store")
      .upload(`images/album/${fileName}`, fileBase64, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    // Handle Supabase upload error
    if (storageError) {
      resp.status(500).json({
        success: false,
        message: "Error uploading image to Supabase",
        error: storageError.message,
      });
      return;
    }

    // Handle missing storage data
    if (!storageData) {
      resp.status(500).json({
        success: false,
        message: "Storage data is null",
      });
      return;
    }

    // Get public image URL
    const imageData = supabase.storage
      .from("music-store")
      .getPublicUrl(storageData.path);

    // Save album to database
    const album = await prisma.album.create({
      data: {
        artistId,
        title,
        genre,
        img: imageData.data.publicUrl,
        releaseDate: isoReleaseDate,
      },
    });

    // Success response
    resp.status(201).json({
      success: true,
      data: album,
      message: "Album created successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Error saving album information",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAlbumById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const albumId = req.params.id;

    // Validate album id
    if (!albumId) {
      resp.status(400).json({
        success: false,
        message: "Album ID is required",
      });
      return;
    }

    const album = await prisma.album.findUnique({
      where: {
        id: albumId,
      },

      select: {
        id: true,
        title: true,
        genre: true,
        img: true,
        releaseDate: true,

        artist: {
          select: {
            id: true,
            name: true,
            img: true,
          },
        },

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

    // Album not found
    if (!album) {
      resp.status(404).json({
        success: false,
        data: null,
        message: "Album not found",
      });
      return;
    }

    // Success response
    resp.status(200).json({
      success: true,
      data: album,
      message: "Album fetched successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const updateAlbumById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const albumId = req.params.id;
    const body = req.body;

    // Validate album id
    if (!albumId) {
      resp.status(400).json({
        success: false,
        message: "Album ID is required",
      });
      return;
    }

    // Check existing album
    const existingAlbum = await prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    // Album not found
    if (!existingAlbum) {
      resp.status(404).json({
        success: false,
        data: null,
        message: "Album not found",
      });
      return;
    }

    // Update album
    const updatedAlbum = await prisma.album.update({
      where: {
        id: albumId,
      },
      data: {
        ...body,
      },
    });

    // Success response
    resp.status(200).json({
      success: true,
      data: updatedAlbum,
      message: "Album updated successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteAlbumById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const albumId = req.params.id;

    // Validate album id
    if (!albumId) {
      resp.status(400).json({
        success: false,
        message: "Album ID is required",
      });
      return;
    }

    // Check existing album
    const existingAlbum = await prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });

    // Album not found
    if (!existingAlbum) {
      resp.status(404).json({
        success: false,
        data: null,
        message: "Album not found",
      });
      return;
    }

    // Delete album
    const deletedAlbum = await prisma.album.delete({
      where: {
        id: albumId,
      },
    });

    // Success response
    resp.status(200).json({
      success: true,
      data: deletedAlbum,
      message: "Album deleted successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export {
  getAllAlbum,
  createAlbum,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
};
