import { Request, Response } from "express";
import User from "../models/user.model";

const handleGetUsers = async (req: Request, resp: Response) => {
  let data = await User.find();
  console.log(data);
  resp.send(data);
};
const handleGetUserById = async (req: Request, resp: Response) => {
  const userId = parseInt(req.params.id);

  const user = await User.findOne( {userId});

  if (user) {
    resp.send(JSON.stringify(user));
  } else {
    resp.status(404).json({ message: "User not found" });
  }
};

export { handleGetUserById, handleGetUsers};
