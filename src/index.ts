import express, { Request, Response } from "express";
import connectMongoDB from "./connection";
import { logReqResp } from "./middleware";

/// Importing Routes
import userRoute from "./routes/user.route";

const app = express();
const port = 3000;

/// Connection
connectMongoDB("mongodb://127.0.0.1:27017/testing-users");

/// MiddleWare...
app.use(express.json());

app.use(logReqResp("log.txt"));
// app.use(cors());

app.use("/user", userRoute);

app.get("/", (req: Request, resp: Response) => {
  resp.send("Application is running Successfully...");
});

app.listen(port, () => {
  console.log(`Application is successfully running at port ${port}`);
});
