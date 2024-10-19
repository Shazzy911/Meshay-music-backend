import { Request, Response } from "../types/file.type";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.config";
import client from "../lib/redis-client";

const getAllUsers = async (req: Request, resp: Response): Promise<void> => {
  try {
    // Check cache first
    const cachedData = await client.get("users");
    if (cachedData) {
      resp
        .status(201)
        .json({ response: JSON.parse(cachedData), source: "redis-cache" });
    } else {
      let data = await prisma.user.findMany();

      if (data && data.length > 0) {
        await client.set("users", JSON.stringify(data), "EX", 3600); // 3600 seconds = 1 hour
        resp.status(200).json({ response: data });
      } else {
        resp.status(404).json({ message: "Users not Found" });
      }
    }
  } catch (error) {
    resp.status(500).json({ error });
  }
};

const createUser = async (req: Request, resp: Response) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    if (!username || !email || !password) {
      resp.status(404).json({ message: "All fields are required" });
    }
    // Saving Encrypted Password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    resp
      .status(201)
      .json({
        success: true,
        result: data,
        message: "User Information Saved Successfully",
      });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// User By Id.
const getUserById = async (req: Request, resp: Response) => {
  try {
    const userId = req.params.id;

    let data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!data) {
      resp.status(404).json({ message: "User not found" });
      return;
    } else {
      resp
        .status(200)
        .json({ data: data, message: "User Infomation Successfully Found" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "User Info Not Updated Successfully" });
  }
};

const updateUserById = async (req: Request, resp: Response) => {
  try {
    const userId = req.params.id;
    const body = req.body;
    // const hashedPassword = ;
    let updatedData = {
      ...body,
    };

    // Check if password exists and is not empty
    if (body.password) {
      updatedData.password = await bcrypt.hash(body.password, 10);
    } else {
      // Optionally remove password if it is not being updated
      delete updatedData.password;
    }

    // let data = await User.updateOne({ userId }, updateUser);
    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });
    resp
      .status(200)
      .json({ data: user, message: "User Info Updated Successfully" });
  } catch (error) {
    console.error(error); // Log the full error object
    resp
      .status(500)
      .json({ error, message: "User Info Not Updated Successfully" });
  }
};

const deleteUserById = async (req: Request, resp: Response) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.delete({
      where: { id: userId },
    });
    if (user) {
      // If no user was deleted, return a 404 Not Found response
      resp.status(200).json({ user, message: "User deleted successfully" });
    } else {
      resp.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    resp.status(500).json({ error, message: "User Not Found" });
  }
};
export { getAllUsers, createUser, getUserById, updateUserById, deleteUserById };
