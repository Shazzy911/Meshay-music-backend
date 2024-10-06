import {Request, Response, NextFunction} from "express"
import fs from "fs";

export const logReqResp = (filename: string)=>{
    return (req: Request, resp: Response, next: NextFunction) => { 
        fs.appendFile(
            filename,
            `\n ${Date.now()}: ${req.ip} ${req.method}: ${req.path}\n`,
            (err) => { 
                if (err) {
                    console.error(err);
                  }
                  next();
             }
        )
     }
}
