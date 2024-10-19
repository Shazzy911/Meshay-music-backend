"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const client = new ioredis_1.default("rediss://default:AaItAAIjcDEzZGUxOTcyMTExNDc0Y2U4ODU2ZDdmODg4NzQ5MDlkYXAxMA@central-cicada-41517.upstash.io:6379");
exports.default = client;
