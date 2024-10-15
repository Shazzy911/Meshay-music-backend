import { Request, Response } from "express";

import prisma from "../lib/prisma.config";
import { supabase } from "../lib/supabaseClient";

const getAllSong = async (req: Request, resp: Response) => {
  try {
    let Song = await prisma.song.findMany();

    if (!Song || Song.length === 0) {
      resp.status(404).json({ message: "Song not Found" });
    }

    resp.status(200).json(Song);
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createSong = async (req: Request, resp: Response) => {
  try {
    const {
      artistId,
      albumId,
      title,
      duration,
      img,
      genre,
      songUrl,
      releaseDate,
    } = req.body;

    if (
      !title ||
      !duration ||
      !img ||
      !genre ||
      !songUrl ||
      !releaseDate ||
      !artistId ||
      !albumId
    ) {
      resp.status(404).json({ message: "All fields are required" });
    }

    // Upload the image to a specific folder in your Supabase storage bucket
    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from("music-store")
    //   .upload(`Song/${file.originalname}`, file.buffer, {
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

    const data = await prisma.song.create({
      data: {
        artistId,
        albumId,
        title,
        duration,
        img,
        genre,
        songUrl,
        releaseDate,
      },
    });

    resp
      .status(201)
      .json({ result: data, message: "Song Information Saved Successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// Song By Id.
const getSongById = async (req: Request, resp: Response) => {
  try {
    const SongId = req.params.id;

    let data = await prisma.song.findUnique({
      where: {
        id: SongId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "Song not found" });
    } else {
      resp
        .status(200)
        .json({ data: data, message: "Song Infomation Successfully Found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Song Info Not Updated Successfully" });
  }
};

const updateSongById = async (req: Request, resp: Response) => {
  try {
    const SongId = req.params.id;
    const body = req.body;

    const existingSong = await prisma.song.findUnique({
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
    const Song = await prisma.song.update({
      where: { id: SongId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: Song, message: "Song Info Updated Successfully" });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Song Info Not Updated Successfully" });
  }
};

const deleteSongById = async (req: Request, resp: Response) => {
  try {
    const SongId = req.params.id;

    const existingSong = await prisma.song.findUnique({
      where: {
        id: SongId,
      },
    });

    if (!existingSong) {
      resp.status(404).json({ message: "Song Not Found" });
    }

    const Song = await prisma.song.delete({
      where: { id: SongId },
    });
    resp.status(200).json({ Song, message: "Song deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Song Not Found" });
  }
};
export { getAllSong, createSong, getSongById, updateSongById, deleteSongById };

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
