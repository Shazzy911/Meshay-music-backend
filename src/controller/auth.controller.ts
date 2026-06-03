import { Request, Response } from "../types/file.type";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      resp.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      resp.status(409).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: userPassword, ...userInfo } = data;

    resp.status(201).json({
      success: true,
      result: userInfo,
      message: "User Information Saved Successfully",
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

const logInUser = async (req: Request, resp: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      resp.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      resp.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      resp.status(401).json({
        success: false,
        message: "Password did not match",
      });
      return;
    }

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY || "",
      {
        expiresIn: "7d",
      },
    );

    const { password: userPassword, ...userInfo } = user;

    resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: age,
      })
      .status(200)
      .json({
        success: true,
        result: userInfo,
        message: "User Login Successfully",
      });

    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "User Login Failed",
    });
    return;
  }
};

const logOutUser = async (req: Request, resp: Response): Promise<void> => {
  try {
    resp
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        message: "User Logout Successfully",
      });

    return;
  } catch (error) {
    resp.status(500).json({
      error,
      message: "Logout Failed",
    });
    return;
  }
};

export { registerUser, logInUser, logOutUser };
