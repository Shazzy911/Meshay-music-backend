import { Request, Response } from "express";

import prisma from "../lib/prisma.config";
// import { supabase } from "../lib/supabaseClient";

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
  try {
    const { name, genre, bio, img } = req.body;

    if (!name || !genre || !bio || !img) {
      resp.status(404).json({ message: "All fields are required" });
    }

    // Upload the image to a specific folder in your Supabase storage bucket
    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from("music-store")
    //   .upload(`artist/${file.originalname}`, file.buffer, {
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

    const data = await prisma.artist.create({
      data: {
        name,
        genre,
        bio,
        img,
      },
    });

    resp
      .status(201)
      .json({ result: data, message: "Artist Information Saved Successfully" });
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
