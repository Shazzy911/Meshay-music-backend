"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logReqResp = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logReqResp = (filename) => {
    return (req, resp, next) => {
        const logMessage = `\n${new Date().toISOString()}: ${req.ip} ${req.method}: ${req.path}\n`;
        // Use path.join to specify the correct path to log.txt
        const filePath = path_1.default.join(__dirname, "..", filename); // Move up one directory to access src
        fs_1.default.appendFile(filePath, logMessage, (err) => {
            if (err) {
                console.error("Error writing to log file:", err);
            }
            next();
        });
    };
};
exports.logReqResp = logReqResp;
