"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.createUser = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_config_1 = __importDefault(require("../lib/prisma.config"));
const redis_client_1 = __importDefault(require("../lib/redis-client"));
const getAllUsers = async (req, resp) => {
    try {
        // Check cache first
        const cachedData = await redis_client_1.default.get("users");
        if (cachedData) {
            resp
                .status(201)
                .json({ response: JSON.parse(cachedData), source: "redis-cache" });
        }
        else {
            let data = await prisma_config_1.default.user.findMany();
            if (data && data.length > 0) {
                await redis_client_1.default.set("users", JSON.stringify(data), "EX", 3600); // 3600 seconds = 1 hour
                resp.status(200).json({ response: data });
            }
            else {
                resp.status(404).json({ message: "Users not Found" });
            }
        }
    }
    catch (error) {
        resp.status(500).json({ error });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, resp) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);
        if (!username || !email || !password) {
            resp.status(404).json({ message: "All fields are required" });
        }
        // Saving Encrypted Password;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const data = await prisma_config_1.default.user.create({
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
    }
    catch (error) {
        resp.status(500).json({ error, message: "Error Saving Information" });
    }
};
exports.createUser = createUser;
/// User By Id.
const getUserById = async (req, resp) => {
    try {
        const userId = req.params.id;
        let data = await prisma_config_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!data) {
            resp.status(404).json({ message: "User not found" });
            return;
        }
        else {
            resp
                .status(200)
                .json({ data: data, message: "User Infomation Successfully Found" });
        }
    }
    catch (error) {
        resp
            .status(500)
            .json({ error, message: "User Info Not Updated Successfully" });
    }
};
exports.getUserById = getUserById;
const updateUserById = async (req, resp) => {
    try {
        const userId = req.params.id;
        const body = req.body;
        // const hashedPassword = ;
        let updatedData = {
            ...body,
        };
        // Check if password exists and is not empty
        if (body.password) {
            updatedData.password = await bcrypt_1.default.hash(body.password, 10);
        }
        else {
            // Optionally remove password if it is not being updated
            delete updatedData.password;
        }
        // let data = await User.updateOne({ userId }, updateUser);
        const user = await prisma_config_1.default.user.update({
            where: { id: userId },
            data: updatedData,
        });
        resp
            .status(200)
            .json({ data: user, message: "User Info Updated Successfully" });
    }
    catch (error) {
        console.error(error); // Log the full error object
        resp
            .status(500)
            .json({ error, message: "User Info Not Updated Successfully" });
    }
};
exports.updateUserById = updateUserById;
const deleteUserById = async (req, resp) => {
    try {
        const userId = req.params.id;
        const user = await prisma_config_1.default.user.delete({
            where: { id: userId },
        });
        if (user) {
            // If no user was deleted, return a 404 Not Found response
            resp.status(200).json({ user, message: "User deleted successfully" });
        }
        else {
            resp.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        resp.status(500).json({ error, message: "User Not Found" });
    }
};
exports.deleteUserById = deleteUserById;
