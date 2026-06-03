"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const client = new ioredis_1.default("rediss://default:gQAAAAAAAQfqAAIgcDFmMWFjZmMxOGM5MjQ0YmNjODlmMDIxOTU0MDdhMzlmOQ@gentle-cat-67562.upstash.io:6379");
exports.default = client;
