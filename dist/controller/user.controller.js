"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.createUser = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const redis_client_1 = __importDefault(require("../lib/redis-client"));
/* =========================
   GET ALL USERS (with Redis)
========================= */
const getAllUsers = async (req, resp) => {
    try {
        const cachedData = await redis_client_1.default.get("users");
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
        const users = await prisma_1.default.user.findMany();
        if (users.length === 0) {
            resp.status(404).json({
                success: false,
                data: [],
                message: "No users found",
            });
            return;
        }
        // Save to Redis cache
        await redis_client_1.default.set("users", JSON.stringify(users), "EX", 3600);
        resp.status(200).json({
            success: true,
            data: users,
            message: "Users fetched successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getAllUsers = getAllUsers;
/* =========================
   CREATE USER
========================= */
const createUser = async (req, resp) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            resp.status(400).json({
                success: false,
                message: "All fields are required",
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        // Clear cache after new user
        await redis_client_1.default.del("users");
        resp.status(201).json({
            success: true,
            data: user,
            message: "User created successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createUser = createUser;
/* =========================
   GET USER BY ID
========================= */
const getUserById = async (req, resp) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            resp.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getUserById = getUserById;
/* =========================
   UPDATE USER
========================= */
const updateUserById = async (req, resp) => {
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
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            resp.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const updatedData = { ...body };
        if (body.password) {
            updatedData.password = await bcrypt_1.default.hash(body.password, 10);
        }
        else {
            delete updatedData.password;
        }
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: updatedData,
        });
        // Clear cache after update
        await redis_client_1.default.del("users");
        resp.status(200).json({
            success: true,
            data: user,
            message: "User updated successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateUserById = updateUserById;
/* =========================
   DELETE USER
========================= */
const deleteUserById = async (req, resp) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            resp.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            resp.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const user = await prisma_1.default.user.delete({
            where: { id: userId },
        });
        // Clear cache after delete
        await redis_client_1.default.del("users");
        resp.status(200).json({
            success: true,
            data: user,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteUserById = deleteUserById;
