"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutUser = exports.logInUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, resp) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            resp.status(400).json({
                message: "All fields are required",
            });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
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
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const data = await prisma_1.default.user.create({
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
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Error Saving Information",
        });
        return;
    }
};
exports.registerUser = registerUser;
const logInUser = async (req, resp) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            resp.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
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
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            resp.status(401).json({
                success: false,
                message: "Password did not match",
            });
            return;
        }
        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY || "", {
            expiresIn: "7d",
        });
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
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "User Login Failed",
        });
        return;
    }
};
exports.logInUser = logInUser;
const logOutUser = async (req, resp) => {
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
    }
    catch (error) {
        resp.status(500).json({
            error,
            message: "Logout Failed",
        });
        return;
    }
};
exports.logOutUser = logOutUser;
