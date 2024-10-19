import { Request, Response } from "../types/file.type";

import prisma from "../lib/prisma.config";
import { IFile } from "../types/file.type";
import supabase from "../lib/supabaseClient";
import { decode } from "base64-arraybuffer";

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
    const { title, genre, releaseDate, artistId } = req.body;
    console.warn(title, genre, releaseDate, artistId);

    if (!artistId || !title || !genre || !releaseDate) {
      resp.status(404).json({ message: "All fields are required" });
    }
    const isoReleaseDate = new Date(releaseDate).toISOString();

    const file = req.file as IFile;
    console.log(file);
    if (!file) {
      resp.status(400).json({ message: "File is missing... not uploaded" });
    }
    // decode file buffer to base64
    const fileBase64 = decode(file.buffer.toString("base64"));
    // upload the file to supabase
    const { data: storageData, error: storageError } = await supabase.storage
      .from("music-store")
      .upload("images/album/" + file.originalname, fileBase64, {
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
      const imageData = supabase.storage
        .from("music-store")
        .getPublicUrl(storageData.path);

      const data = await prisma.album.create({
        data: {
          artistId,
          title,
          genre,
          img: imageData?.data?.publicUrl || "", // Use the public URL for the image,
          releaseDate: isoReleaseDate,
        },
      });
      resp.status(201).json({
        success: true,
        result: data,
        message: "Album Information Saved Successfully",
      });
    } else {
      // Handle the case where storageData is null
      resp.status(500).json({
        message: "Error uploading file, storage data is null",
      });
    }
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
