import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

import mongoConn from "./db/dbcon.js";
import authRoutes from "./routes/authRoute.js";
import routes from "./routes/route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --------- DB connection middleware ----------
let isDbConnected = false;

app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await mongoConn();
    isDbConnected = true;
    console.log("MongoDB connected (serverless)");
  }
  next();
});

// --------- EXPRESS MIDDLEWARES ----------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

app.use(
  cors({
    origin: [
      process.env.APP_URL_DEVQ,
      process.env.APP_URL_DEVP,
      process.env.APP_URL_LIVQ,
      process.env.APP_URL_LIVP,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------- ROUTES ----------
app.use("/auth", authRoutes);
app.use("/", routes);

app.get("/", (req, res) => {
  res.json({ status: "API OK on Vercel" });
});

// --------- SERVERLESS EXPORT ----------
export default serverless(app);
