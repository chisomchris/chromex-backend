// import { version, validate } from "uuid";
import fs from "fs";
import path from "path";
// import { db } from "../models";
import { Request, Response } from "express";
import { mergeFileChunk, writeStream } from "../utils/writeStream";
import { v4 as uuidv4 } from "uuid";
// import { getScreenshot } from "../services/screenshot";
// import { transcribeVideo } from "../services/transcript";

export const createStreamLink = async (req: Request, res: Response) => {
  try {
    const video_id = uuidv4().replace(/-/g, "");
    if (!fs.existsSync(path.join(__dirname, "../videos"))) {
      fs.mkdirSync(path.join(__dirname, "../videos"), { recursive: true });
    }
    const UPLOAD_DIR = path.resolve(__dirname, "../videos", "temp", video_id);
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    res.status(201).json({
      success: true,
      video_id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const uploadStreamData = async (req: Request, res: Response) => {
  try {
    const { upload_url } = req.params;
    exists(res, upload_url);
    const filename = req.file?.originalname;
    if (filename && req.file && req.file.buffer instanceof Buffer) {
      await writeStream(upload_url, filename, req.file.buffer);
      res.status(200).json({
        success: true,
        message: "video chunk saved successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid Data",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const mergeFile = async (req: Request, res: Response) => {
  try {
    const { video_id, chunkSize } = req.body;

    exists(res, video_id);
    await mergeFileChunk(video_id, chunkSize);

    // USE MICROSERVICES
    // take screenshot
    // try {
    //   getScreenshot(video_id);
    // } catch (error) {
    //   console.error(error);
    // }

    // transcribe
    // try {
    //   transcribeVideo(video_id);
    // } catch (error) {
    //   console.error(error);
    // }

    res.status(200).json({
      success: true,
      video_id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const streamVideo = async (req: Request, res: Response) => {
  try {
    const { upload_url } = req.params;
    const videoPath = path.join(__dirname, "../videos", `${upload_url}.webm`);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/webm",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/webm",
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const exists = (res: Response, dirname: string) => {
  const exists = fs.existsSync(
    path.resolve(__dirname, "../videos/temp", dirname)
  );

  if (!exists) {
    res.status(400).json({
      success: false,
      message: "Invalid Url",
    });
  }
};
