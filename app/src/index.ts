import { app } from "./config/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 4000;

const main = async () => {
  app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
  });
};

main();
