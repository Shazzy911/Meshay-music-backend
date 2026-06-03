import { Request, Response } from "../types/file.type";
import prisma from "../lib/prisma";

const getAllRating = async (req: Request, resp: Response): Promise<void> => {
  try {
    const rating = await prisma.rating.findMany();

    if (!rating || rating.length === 0) {
      resp.status(404).json({
        message: "Rating not Found",
      });
      return;
    }

    resp.status(200).json({
      data: rating,
      message: "Ratings fetched successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({ error });
    return;
  }
};

const createRating = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { rating, userId, songId } = req.body;

    if (!rating || !songId || !userId) {
      resp.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const data = await prisma.rating.create({
      data: {
        userId,
        songId,
        rating,
      },
    });

    resp.status(201).json({
      success: true,
      result: data,
      message: "Rating Information Saved Successfully",
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

const getRatingById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const ratingId = req.params.id;

    const data = await prisma.rating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!data) {
      resp.status(404).json({
        message: "Rating not found",
      });
      return;
    }

    resp.status(200).json({
      data,
      message: "Rating Information Successfully Found",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Rating Info Not Found",
    });
    return;
  }
};

const updateRatingById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const ratingId = req.params.id;
    const body = req.body;

    const existingRating = await prisma.rating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!existingRating) {
      resp.status(404).json({
        message: "Rating Not Found",
      });
      return;
    }

    const updatedData = {
      ...body,
    };

    const rating = await prisma.rating.update({
      where: {
        id: ratingId,
      },
      data: updatedData,
    });

    resp.status(200).json({
      data: rating,
      message: "Rating Info Updated Successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Rating Info Not Updated Successfully",
    });
    return;
  }
};

const deleteRatingById = async (
  req: Request,
  resp: Response,
): Promise<void> => {
  try {
    const ratingId = req.params.id;

    const existingRating = await prisma.rating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!existingRating) {
      resp.status(404).json({
        message: "Rating Not Found",
      });
      return;
    }

    const rating = await prisma.rating.delete({
      where: {
        id: ratingId,
      },
    });

    resp.status(200).json({
      rating,
      message: "Rating deleted successfully",
    });
    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Rating Not Found",
    });
    return;
  }
};

export {
  getAllRating,
  createRating,
  getRatingById,
  updateRatingById,
  deleteRatingById,
};
