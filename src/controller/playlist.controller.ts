import { Request, Response } from "../types/file.type";
import prisma from "../lib/prisma";

const getAllPlaylist = async (req: Request, resp: Response): Promise<void> => {
  try {
    const playlist = await prisma.playlist.findMany();

    if (!playlist || playlist.length === 0) {
      resp.status(404).json({
        message: "Playlist not Found",
      });
      return;
    }

    resp.status(200).json({
      data: playlist,
      message: "Playlists fetched successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({ error });
    return;
  }
};

const createPlaylist = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { title, userId, description } = req.body;

    if (!title || !description || !userId) {
      resp.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const data = await prisma.playlist.create({
      data: {
        userId,
        title,
        description,
      },
    });

    resp.status(201).json({
      success: true,
      result: data,
      message: "Playlist Information Saved Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Error Saving Information",
    });
    return;
  }
};

const getPlaylistById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const playlistId = req.params.id;

    const data = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!data) {
      resp.status(404).json({
        message: "Playlist not found",
      });
      return;
    }

    resp.status(200).json({
      data,
      message: "Playlist Information Successfully Found",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Playlist Info Not Found",
    });
    return;
  }
};

const updatePlaylistById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const playlistId = req.params.id;
    const body = req.body;

    const existingPlaylist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!existingPlaylist) {
      resp.status(404).json({
        message: "Playlist Not Found",
      });
      return;
    }

    const updatedData = {
      ...body,
    };

    const playlist = await prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: updatedData,
    });

    resp.status(200).json({
      data: playlist,
      message: "Playlist Info Updated Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Playlist Info Not Updated Successfully",
    });
    return;
  }
};

const deletePlaylistById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const playlistId = req.params.id;

    const existingPlaylist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!existingPlaylist) {
      resp.status(404).json({
        message: "Playlist Not Found",
      });
      return;
    }

    const playlist = await prisma.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    resp.status(200).json({
      playlist,
      message: "Playlist deleted successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Playlist Not Found",
    });
    return;
  }
};

export {
  getAllPlaylist,
  createPlaylist,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
};
