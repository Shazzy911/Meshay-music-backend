import { Request, Response } from "../types/file.type";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.config";

const registerUser = async (req: Request, resp: Response) => {
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

    resp.status(201).json({
      success: true,
      result: data,
      message: "User Information Saved Successfully",
    });
  } catch (error) {
    resp.status(500).json({ error, message: "Error Saving Information" });
  }
};

/// User By Id.
const logInUser = async (req: Request, resp: Response) => {
  try {
    const { username, password } = req.body;
    // CHECK IF THE USER EXISTS

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        resp
          .status(404)
          .json({ success: false, message: "Password did not match " });
        return;
      } else {
        resp
          .status(200)
          .json({
            success: true,
            result: user,
            message: "User Login successfully",
          });
      }
    } else {
      resp
        .status(400)
        .json({ msuccess: false, essage: "Invalid Credentials!" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "User Info Not Updated Successfully" });
  }
};

const logOutUser = async (req: Request, resp: Response) => {};
export { registerUser, logInUser, logOutUser };
