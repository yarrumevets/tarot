// import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedPath = path.resolve(__dirname, "../.env");
const appPath = path.resolve(__dirname, ".env");

// console.log("Shared .env exists:", fs.existsSync(sharedPath));
// console.log("Shared .env contents:\n", fs.readFileSync(sharedPath, "utf8"));

dotenv.config({ path: sharedPath });
dotenv.config({ path: appPath });

console.log("MONGODB_URL after config:", process.env.MONGODB_URL);
