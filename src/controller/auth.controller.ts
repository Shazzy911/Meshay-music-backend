import { Request, Response } from "../types/file.type";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.config";
import jwt from "jsonwebtoken";
const registerUser = async (req: Request, resp: Response) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    if (!(username || email || password)) {
      resp.status(404).json({ message: "All fields are required" });
    }
    let existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      resp.status(401).json({
        success: true,
        result: existingUser,
        message: "User Already exists",
      });
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
    const { email, password } = req.body;
    console.log(email, password);
    // CHECK IF THE USER EXISTS

    const user = await prisma.user.findUnique({
      where: {
        email: email,
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
        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
          {
            id: user.id,
            isAdmin: false,
          },
          process.env.JWT_SECRET_KEY || " ",
          { expiresIn: age }
        );
        const { password: userPassword, ...userInfo } = user;

        resp
          .cookie("token", token, {
            httpOnly: true, // User this when on production.. Works on https only
            secure: true,
            maxAge: age,
          })
          .status(200)
          .json({
            success: true,
            result: userInfo,
            message: "User Login Successfully",
          });
      }
    } else {
      resp.status(400).json({ success: false, essage: "Invalid Credentials!" });
    }
  } catch (error) {
    resp
      .status(500)
      .json({ error, message: "User Info Not Updated Successfully" });
  }
};

const logOutUser = async (req: Request, resp: Response) => {};
export { registerUser, logInUser, logOutUser };
