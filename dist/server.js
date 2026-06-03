"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookieParser = require("cookie-parser");
const middleware_1 = require("./middleware");
/// Importing Routes
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const artist_route_1 = __importDefault(require("./routes/artist.route"));
const album_route_1 = __importDefault(require("./routes/album.route"));
const song_route_1 = __importDefault(require("./routes/song.route"));
const playlist_route_1 = __importDefault(require("./routes/playlist.route"));
const playlistSong_route_1 = __importDefault(require("./routes/playlistSong.route"));
const rating_route_1 = __importDefault(require("./routes/rating.route"));
const subscription_route_1 = __importDefault(require("./routes/subscription.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const app = (0, express_1.default)();
const port = process.env.PORT;
/// MiddleWare...
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "").split(",");
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// app.use(
//   cors({
//     origin: process.env.ALLOWED_ORIGIN,
//     credentials: true,
//   })
// );
app.use(cookieParser("my_secret"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, middleware_1.logReqResp)("log.txt"));
// Routes
app.use("/auth", auth_route_1.default);
app.use("/user", user_route_1.default);
app.use("/artist", artist_route_1.default);
app.use("/album", album_route_1.default);
app.use("/song", song_route_1.default);
app.use("/playlist", playlist_route_1.default);
app.use("/playlistsong", playlistSong_route_1.default);
app.use("/rating", rating_route_1.default);
app.use("/subscription", subscription_route_1.default);
app.use("/payment", payment_route_1.default);
app.get("/", (req, resp) => {
    resp.send("Application is running Successfully...");
});
app.listen(port, () => {
    console.log(`Application is successfully running at port ${port}`);
});
