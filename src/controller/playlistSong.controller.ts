import { Request, Response } from "express";

import prisma from "../lib/prisma.config";
// import { supabase } from "../lib/supabaseClient";

const getAllPlaylistSong = async (req: Request, resp: Response) => {
  try {
    let PlaylistSong = await prisma.playlistSong.findMany();

    if (!PlaylistSong || PlaylistSong.length === 0) {
      resp.status(404).json({ message: "PlaylistSong not Found" });
    }

    resp.status(200).json(PlaylistSong);
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createPlaylistSong = async (req: Request, resp: Response) => {
  try {
    const { playlistId, songId } = req.body;

    if (!playlistId || !songId) {
      resp.status(404).json({ message: "All fields are required" });
    }

    // Upload the image to a specific folder in your Supabase storage bucket
    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from("music-store")
    //   .upload(`PlaylistSong/${file.originalname}`, file.buffer, {
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

    const data = await prisma.playlistSong.create({
      data: {
        playlistId,
        songId,
      },
    });

    resp.status(201).json({
      result: data,
      message: "PlaylistSong Information Saved Successfully",
    });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// PlaylistSong By Id.
const getPlaylistSongById = async (req: Request, resp: Response) => {
  try {
    const PlaylistSongId = req.params.id;

    let data = await prisma.playlistSong.findUnique({
      where: {
        id: PlaylistSongId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "PlaylistSong not found" });
    } else {
      resp.status(200).json({
        data: data,
        message: "PlaylistSong Infomation Successfully Found",
      });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "PlaylistSong Info Not Updated Successfully" });
  }
};

const updatePlaylistSongById = async (req: Request, resp: Response) => {
  try {
    const PlaylistSongId = req.params.id;
    const body = req.body;

    const existingPlaylistSong = await prisma.playlistSong.findUnique({
      where: {
        id: PlaylistSongId,
      },
    });

    if (!existingPlaylistSong) {
      resp.status(404).json({ message: "PlaylistSong Not Found" });
    }

    let updatedData = {
      ...body,
    };

    // let data = await PlaylistSong.updateOne({ PlaylistSongId }, updatePlaylistSong);
    const PlaylistSong = await prisma.playlistSong.update({
      where: { id: PlaylistSongId },
      data: updatedData,
    });
    resp.status(200).json({
      data: PlaylistSong,
      message: "PlaylistSong Info Updated Successfully",
    });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "PlaylistSong Info Not Updated Successfully" });
  }
};

const deletePlaylistSongById = async (req: Request, resp: Response) => {
  try {
    const PlaylistSongId = req.params.id;

    const existingPlaylistSong = await prisma.playlistSong.findUnique({
      where: {
        id: PlaylistSongId,
      },
    });

    if (!existingPlaylistSong) {
      resp.status(404).json({ message: "PlaylistSong Not Found" });
    }

    const PlaylistSong = await prisma.playlistSong.delete({
      where: { id: PlaylistSongId },
    });
    resp
      .status(200)
      .json({ PlaylistSong, message: "PlaylistSong deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "PlaylistSong Not Found" });
  }
};
export {
  getAllPlaylistSong,
  createPlaylistSong,
  getPlaylistSongById,
  updatePlaylistSongById,
  deletePlaylistSongById,
};
