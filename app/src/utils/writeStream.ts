import fs from "fs";
import path from "path";

export const writeStream = async (
  filename: string,
  chunk: string,
  buffer: Buffer
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(path.join(__dirname, "../videos"))) {
      fs.mkdirSync(path.join(__dirname, "../videos"), { recursive: true });
    }

    const UPLOAD_DIR = path.resolve(__dirname, "../videos", "temp");
    const chunkDir = path.resolve(UPLOAD_DIR, filename);

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    const fileStream = fs.createWriteStream(
      path.join(chunkDir, `${chunk}.webm`),
      { flags: "a" }
    );

    fileStream.write(buffer, "base64");

    fileStream.on("error", () => reject());

    fileStream.on("finish", () => resolve());

    fileStream.end();
  });
};

export const mergeFileChunk = async (
  filename: string,
  chunkSize = 6_000_000
) => {
  const UPLOAD_DIR = path.resolve(__dirname, "../videos", "temp");
  const chunkDir = path.resolve(UPLOAD_DIR, filename);
  const chunkPaths = fs.readdirSync(chunkDir);

  // sort by chunk index
  chunkPaths.sort((a, b) => +a.split(".")[0] - +b.split(".")[0]);
  // write file concurrently
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
        // create write stream at the specified starting location according to chunk size
        fs.createWriteStream(
          path.resolve(__dirname, "../videos", `${filename}.webm`),
          {
            start: index * chunkSize,
          }
        )
      )
    )
  );
  // delete chunk directory after merging
  fs.rmdirSync(chunkDir);
};

const pipeStream = (path: fs.PathLike, writeStream: any): Promise<void> =>
  new Promise((resolve) => {
    const readStream = fs.createReadStream(path);
    readStream.on("end", () => {
      fs.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
