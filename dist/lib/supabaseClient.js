"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from the .env file
dotenv_1.default.config();
const SUPABASE_URL = ((_a = process.env.SUPABASE_URL) === null || _a === void 0 ? void 0 : _a.trim()) || "";
const SUPABASE_ANON_KEY = ((_b = process.env.SUPABASE_ANON_KEY) === null || _b === void 0 ? void 0 : _b.trim()) || "";
// Check if URL is valid before creating the client
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL or ANON Key is not defined!");
}
// Initialize Supabase client
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
exports.default = supabase; // Default export
