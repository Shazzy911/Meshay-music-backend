import multer from "multer";
// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
export const upload = multer({ storage: storage });
