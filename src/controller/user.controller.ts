import { Request, Response } from "../types/file.type";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import client from "../lib/redis-client";

/* =========================
   GET ALL USERS (with Redis)
========================= */
const getAllUsers = async (req: Request, resp: Response): Promise<void> => {
  try {
    const cachedData = await client.get("users");

    // Return cached data
    if (cachedData) {
      resp.status(200).json({
        success: true,
        data: JSON.parse(cachedData),
        source: "redis-cache",
        message: "Users fetched from cache",
      });
      return;
    }

    const users = await prisma.user.findMany();

    if (users.length === 0) {
      resp.status(404).json({
        success: false,
        data: [],
        message: "No users found",
      });
      return;
    }

    // Save to Redis cache
    await client.set("users", JSON.stringify(users), "EX", 3600);

    resp.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   CREATE USER
========================= */
const createUser = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      resp.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Clear cache after new user
    await client.del("users");

    resp.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Error creating user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   GET USER BY ID
========================= */
const getUserById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      resp.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      resp.status(404).json({
        success: false,
        data: null,
        message: "User not found",
      });
      return;
    }

    resp.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   UPDATE USER
========================= */
const updateUserById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const body = req.body;

    if (!userId) {
      resp.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      resp.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updatedData: any = { ...body };

    if (body.password) {
      updatedData.password = await bcrypt.hash(body.password, 10);
    } else {
      delete updatedData.password;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    // Clear cache after update
    await client.del("users");

    resp.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/* =========================
   DELETE USER
========================= */
const deleteUserById = async (req: Request, resp: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      resp.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      resp.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const user = await prisma.user.delete({
      where: { id: userId },
    });

    // Clear cache after delete
    await client.del("users");

    resp.status(200).json({
      success: true,
      data: user,
      message: "User deleted successfully",
    });
  } catch (error) {
    resp.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { getAllUsers, createUser, getUserById, updateUserById, deleteUserById };
