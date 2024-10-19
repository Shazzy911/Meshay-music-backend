"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Store uploaded files in memory
const storage = multer_1.default.memoryStorage();
// Initialize multer with the storage configuration
exports.upload = (0, multer_1.default)({ storage: storage });
