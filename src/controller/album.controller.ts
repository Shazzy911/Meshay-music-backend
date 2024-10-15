import { Request, Response } from "express";

import prisma from "../lib/prisma.config";
// import { supabase } from "../lib/supabaseClient";

const getAllAlbum = async (req: Request, resp: Response) => {
  try {
    let Album = await prisma.album.findMany();

    if (!Album || Album.length === 0) {
      resp.status(404).json({ message: "Album not Found" });
    }

    resp.status(200).json(Album);
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createAlbum = async (req: Request, resp: Response) => {
  try {
    const { title, duration, img, genre, AlbumUrl, releaseDate, artistId } =
      req.body;

    if (!artistId || !title || !genre || !img || !releaseDate) {
      resp.status(404).json({ message: "All fields are required" });
    }

    // Upload the image to a specific folder in your Supabase storage bucket
    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from("music-store")
    //   .upload(`Album/${file.originalname}`, file.buffer, {
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

    const data = await prisma.album.create({
      data: {
        artistId,
        title,
        genre,
        img,
        releaseDate,
      },
    });

    resp
      .status(201)
      .json({ result: data, message: "Album Information Saved Successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// Album By Id.
const getAlbumById = async (req: Request, resp: Response) => {
  try {
    const AlbumId = req.params.id;

    let data = await prisma.album.findUnique({
      where: {
        id: AlbumId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "Album not found" });
    } else {
      resp
        .status(200)
        .json({ data: data, message: "Album Infomation Successfully Found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Album Info Not Updated Successfully" });
  }
};

const updateAlbumById = async (req: Request, resp: Response) => {
  try {
    const AlbumId = req.params.id;
    const body = req.body;

    const existingAlbum = await prisma.album.findUnique({
      where: {
        id: AlbumId,
      },
    });

    if (!existingAlbum) {
      resp.status(404).json({ message: "Album Not Found" });
    }

    let updatedData = {
      ...body,
    };

    // let data = await Album.updateOne({ AlbumId }, updateAlbum);
    const Album = await prisma.album.update({
      where: { id: AlbumId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: Album, message: "Album Info Updated Successfully" });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Album Info Not Updated Successfully" });
  }
};

const deleteAlbumById = async (req: Request, resp: Response) => {
  try {
    const AlbumId = req.params.id;

    const existingAlbum = await prisma.album.findUnique({
      where: {
        id: AlbumId,
      },
    });

    if (!existingAlbum) {
      resp.status(404).json({ message: "Album Not Found" });
    }

    const Album = await prisma.album.delete({
      where: { id: AlbumId },
    });
    resp.status(200).json({ Album, message: "Album deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Album Not Found" });
  }
};
export {
  getAllAlbum,
  createAlbum,
  getAlbumById,
  updateAlbumById,
  deleteAlbumById,
};
