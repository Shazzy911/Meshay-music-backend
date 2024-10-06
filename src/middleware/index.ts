import {Request, Response, NextFunction} from "express"
import fs from "fs";
import path from "path";

export const logReqResp = (filename: string)=>{
    return (req: Request, resp: Response, next: NextFunction) => {
        const logMessage = `\n${new Date().toISOString()}: ${req.ip} ${req.method}: ${req.path}\n`;

        // Use path.join to specify the correct path to log.txt
        const filePath = path.join(__dirname, '..', filename); // Move up one directory to access src

        fs.appendFile(filePath, logMessage, (err) => {
            if (err) {
                console.error("Error writing to log file:", err);
            }
            next();
        });
    };
}
