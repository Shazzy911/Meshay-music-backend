import { Request, Response } from "../types/file.type";
import prisma from "../lib/prisma";

const getAllPlaylistSong = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const playlistSong = await prisma.playlistSong.findMany();

    if (!playlistSong || playlistSong.length === 0) {
      resp.status(404).json({
        message: "PlaylistSong not Found",
      });
      return;
    }

    resp.status(200).json({
      data: playlistSong,
      message: "PlaylistSongs fetched successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({ error });
    return;
  }
};

const createPlaylistSong = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const { playlistId, songId } = req.body;

    if (!playlistId || !songId) {
      resp.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const data = await prisma.playlistSong.create({
      data: {
        playlistId,
        songId,
      },
    });

    resp.status(201).json({
      success: true,
      result: data,
      message: "PlaylistSong Information Saved Successfully",
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

const getPlaylistSongById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const playlistSongId = req.params.id;

    const data = await prisma.playlistSong.findUnique({
      where: {
        id: playlistSongId,
      },
    });

    if (!data) {
      resp.status(404).json({
        message: "PlaylistSong not found",
      });
      return;
    }

    resp.status(200).json({
      data,
      message: "PlaylistSong Information Successfully Found",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "PlaylistSong Info Not Found",
    });
    return;
  }
};

const updatePlaylistSongById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const playlistSongId = req.params.id;
    const body = req.body;

    const existingPlaylistSong = await prisma.playlistSong.findUnique({
      where: {
        id: playlistSongId,
      },
    });

    if (!existingPlaylistSong) {
      resp.status(404).json({
        message: "PlaylistSong Not Found",
      });
      return;
    }

    const updatedData = {
      ...body,
    };

    const playlistSong = await prisma.playlistSong.update({
      where: {
        id: playlistSongId,
      },
      data: updatedData,
    });

    resp.status(200).json({
      data: playlistSong,
      message: "PlaylistSong Info Updated Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "PlaylistSong Info Not Updated Successfully",
    });
    return;
  }
};

const deletePlaylistSongById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const playlistSongId = req.params.id;

    const existingPlaylistSong = await prisma.playlistSong.findUnique({
      where: {
        id: playlistSongId,
      },
    });

    if (!existingPlaylistSong) {
      resp.status(404).json({
        message: "PlaylistSong Not Found",
      });
      return;
    }

    const playlistSong = await prisma.playlistSong.delete({
      where: {
        id: playlistSongId,
      },
    });

    resp.status(200).json({
      playlistSong,
      message: "PlaylistSong deleted successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "PlaylistSong Not Found",
    });
    return;
  }
};

export {
  getAllPlaylistSong,
  createPlaylistSong,
  getPlaylistSongById,
  updatePlaylistSongById,
  deletePlaylistSongById,
};
