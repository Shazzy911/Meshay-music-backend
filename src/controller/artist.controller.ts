import { Request, Response } from "express";
import { decode } from "base64-arraybuffer";
import prisma from "../lib/prisma.config";
import { IFile } from "../types/file.type";
import supabase from "../lib/supabaseClient";

const getAllArtist = async (req: Request, resp: Response) => {
  try {
    let artist = await prisma.artist.findMany({
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
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createArtist = async (req: Request, resp: Response) => {
  // {file: File},
  try {
    const { name, genre, bio } = req.body;
    if (!name || !genre || !bio) {
      resp.status(404).json({ message: "All fields are required" });
    }
    const file = req.file as IFile;
    if (!file) {
      resp.status(400).json({ message: "File is missing... not uploaded" });
    }
    // decode file buffer to base64
    const fileBase64 = decode(file.buffer.toString("base64"));
    // upload the file to supabase
    const { data: storageData, error: storageError } = await supabase.storage
      .from("music-store")
      .upload(file.originalname, fileBase64, {
        contentType: file.mimetype,
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
        .from("music-store/images")
        .getPublicUrl(storageData.path);

      const artistData = await prisma.artist.create({
        data: {
          name,
          genre,
          bio,
          img: imageData?.data?.publicUrl || "", // Use the public URL for the image,
        },
      });

      resp.status(201).json({
        result: artistData,
        message: "Artist Information Saved Successfully",
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

/// Artist By Id.
const getArtistById = async (req: Request, resp: Response) => {
  try {
    const ArtistId = req.params.id;

    let data = await prisma.artist.findUnique({
      where: {
        id: ArtistId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "Artist not found" });
    } else {
      resp
        .status(200)
        .json({ data: data, message: "Artist Infomation Successfully Found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Artist Info Not Updated Successfully" });
  }
};

const updateArtistById = async (req: Request, resp: Response) => {
  try {
    const ArtistId = req.params.id;
    const body = req.body;

    const existingArtist = await prisma.artist.findUnique({
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
    const Artist = await prisma.artist.update({
      where: { id: ArtistId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: Artist, message: "Artist Info Updated Successfully" });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Artist Info Not Updated Successfully" });
  }
};

const deleteArtistById = async (req: Request, resp: Response) => {
  try {
    const ArtistId = req.params.id;

    const existingArtist = await prisma.artist.findUnique({
      where: {
        id: ArtistId,
      },
    });

    if (!existingArtist) {
      resp.status(404).json({ message: "Artist Not Found" });
    }

    const Artist = await prisma.artist.delete({
      where: { id: ArtistId },
    });
    resp.status(200).json({ Artist, message: "Artist deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Artist Not Found" });
  }
};
export {
  getAllArtist,
  createArtist,
  getArtistById,
  updateArtistById,
  deleteArtistById,
};
