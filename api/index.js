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

// --------- ENV SETTINGS ----------
const apienv = process.env.NODE_ENV || "dev";
const appenv = process.env.APP_ENV || "quality";

const allowedOrigins = {
  dev: {
    quality: [process.env.APP_URL_DEVQ],
    production: [process.env.APP_URL_DEVP],
  },
  live: {
    quality: [process.env.APP_URL_LIVQ],
    production: [process.env.APP_URL_LIVP],
  },
};

const origins =
  allowedOrigins?.[apienv]?.[appenv] || ["http://localhost:3502"];

// --------- EXPRESS MIDDLEWARES ----------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------- ROUTES ----------
app.use("/auth", authRoutes);
app.use("/", routes);

// --------- SERVERLESS HANDLER ----------
const handler = serverless(async (req, res) => {
  // ensure DB is connected on cold start
  if (!global.__mongoConnected) {
    await mongoConn();
    global.__mongoConnected = true;
    console.log("MongoDB connected (serverless)");
  }
  return app(req, res);
});

export default handler;
