import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL?.trim() || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim() || "";

// Check if URL is valid before creating the client
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL or ANON Key is not defined!");
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase; // Default export
