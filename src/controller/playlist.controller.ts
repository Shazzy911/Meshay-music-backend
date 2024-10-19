import { Request, Response } from "../types/file.type";

import prisma from "../lib/prisma.config";
// import { supabase } from "../lib/supabaseClient";

const getAllPlaylist = async (req: Request, resp: Response) => {
  try {
    let Playlist = await prisma.playlist.findMany();

    if (!Playlist || Playlist.length === 0) {
      resp.status(404).json({ message: "Playlist not Found" });
    }

    resp.status(200).json(Playlist);
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createPlaylist = async (req: Request, resp: Response) => {
  try {
    const { title, userId, description } = req.body;

    if (!title || !description || !userId) {
      resp.status(404).json({ message: "All fields are required" });
    }

    // Upload the image to a specific folder in your Supabase storage bucket
    // const { data: storageData, error: storageError } = await supabase.storage
    //   .from("music-store")
    //   .upload(`Playlist/${file.originalname}`, file.buffer, {
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

    const data = await prisma.playlist.create({
      data: {
        userId,
        title,
        description,
      },
    });

    resp.status(201).json({
      result: data,
      message: "Playlist Information Saved Successfully",
    });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// Playlist By Id.
const getPlaylistById = async (req: Request, resp: Response) => {
  try {
    const PlaylistId = req.params.id;

    let data = await prisma.playlist.findUnique({
      where: {
        id: PlaylistId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "Playlist not found" });
    } else {
      resp.status(200).json({
        data: data,
        message: "Playlist Infomation Successfully Found",
      });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Playlist Info Not Updated Successfully" });
  }
};

const updatePlaylistById = async (req: Request, resp: Response) => {
  try {
    const PlaylistId = req.params.id;
    const body = req.body;

    const existingPlaylist = await prisma.playlist.findUnique({
      where: {
        id: PlaylistId,
      },
    });

    if (!existingPlaylist) {
      resp.status(404).json({ message: "Playlist Not Found" });
    }

    let updatedData = {
      ...body,
    };

    // let data = await Playlist.updateOne({ PlaylistId }, updatePlaylist);
    const Playlist = await prisma.playlist.update({
      where: { id: PlaylistId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: Playlist, message: "Playlist Info Updated Successfully" });
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "Playlist Info Not Updated Successfully" });
  }
};

const deletePlaylistById = async (req: Request, resp: Response) => {
  try {
    const PlaylistId = req.params.id;

    const existingPlaylist = await prisma.playlist.findUnique({
      where: {
        id: PlaylistId,
      },
    });

    if (!existingPlaylist) {
      resp.status(404).json({ message: "Playlist Not Found" });
    }

    const Playlist = await prisma.playlist.delete({
      where: { id: PlaylistId },
    });
    resp
      .status(200)
      .json({ Playlist, message: "Playlist deleted successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Playlist Not Found" });
  }
};
export {
  getAllPlaylist,
  createPlaylist,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
};
