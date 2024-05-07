import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { sequelize } from "../config/dbconfig";
import { Sequelize } from "sequelize";
import video from "./video.model";

interface DB {
  sequelize: Sequelize;
  video: ReturnType<typeof video>;
  Sequelize: typeof Sequelize;
  connectToDatabase: () => Promise<void>;
}

sequelize.sync({ force: true }).then(() => {
  console.log("Database syncing done");
});

export const db: DB = {
  sequelize,
  Sequelize,
  video: video(sequelize),
  connectToDatabase: async function () {
    return await sequelize.authenticate();
  },
};
