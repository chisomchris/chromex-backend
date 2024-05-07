import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import videoRouter from "../routes/videos.route";
import { errorHandler } from "../middlewares/error-handler";
import { notFound } from "../middlewares/not-found";
import path from "path";

export const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
console.log(process.env.NODE_ENV);

// ROUTES
app.use("/images", express.static(path.join(__dirname, "../public", "images")));
app.use("/api/v1/videos", videoRouter);

// MIDDLEWARES
app.use(notFound);
app.use(errorHandler);
