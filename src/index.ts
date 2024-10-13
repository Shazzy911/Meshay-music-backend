import express, { Request, Response } from "express";
import cors from "cors";
import { logReqResp } from "./middleware";

/// Importing Routes
import userRoute from "./routes/user.route";

const app = express();
const port = 3000;

/// MiddleWare...
app.use(express.json());
app.use(logReqResp("log.txt"));
app.use(cors());

app.use("/user", userRoute);

app.get("/", (req: Request, resp: Response) => {
  resp.send("Application is running Successfully...");
});

app.listen(port, () => {
  console.log(`Application is successfully running at port ${port}`);
});
