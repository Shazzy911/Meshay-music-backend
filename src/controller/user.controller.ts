import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
const handleGetUsers = async (req: Request, resp: Response) => {
  try {
    let data = await User.find();
    resp.status(200).json({ response: data });
  } catch (error) {
    resp.status(200).json({ error });
  }
};
const handleCreateUser = async (req: Request, resp: Response) => {
  try {
    // let data = new User(req.body);
    // let result = await data.save();
    const body = req.body;
    if (
      !body ||
      !body.userId ||
      !body.username ||
      !body.email ||
      !body.password
    ) {
      resp.status(404).json({ message: "All fields are required" });
    }
    // Saving Encrypted Password;
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const result = await User.create({
      userId: body.userId,
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    resp
      .status(201)
      .json({ result: result, message: "User Information Saved Successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// User By Id.
const handleGetUserById = async (req: Request, resp: Response) => {
  try {
    const userId = parseInt(req.params.id);
    

    let data = await User.findOne({ userId: userId });
    if (!data) {
      resp.status(404).json({ message: "User not found" });
      return;
    } else {
      resp
        .status(200)
        .json({ data: data, message: "User Infomation Successfully Found" });
    }
  } catch (error) {
    resp.status(500).json({ error, message: "User Information Error" });
  }
};
const handleUpdateUserById = async (req: Request, resp: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const body = req.body;
    // const hashedPassword = ;
    let updateUser = { ...req.body, password: await bcrypt.hash(body.password, 10) };
    let data = await User.updateOne({ userId }, updateUser);
    resp
      .status(200)
      .json({ data: data, message: "User Info Updated Successfully" });
  } catch (error) {
    resp.status(500).json({ error, message: "User Info Updated Successfully" });
  }
};
const handleDeleteUserById = async (req: Request, resp: Response) => {
  try {
    const userId = parseInt(req.params.id);

    let data = await User.deleteOne({ userId: userId });
    if (data.deletedCount === 0) {
      // If no user was deleted, return a 404 Not Found response
      resp.status(404).json({ message: "User not found" });
    } else {
      resp.status(200).json({ data, message: "User deleted successfully" });
    }
  } catch (error) {
    resp.status(500).json({ error, message: "User Not Found" });
  }
};
export {
  handleGetUsers,
  handleCreateUser,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
};
