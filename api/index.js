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

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------- ENV SETTINGS ----------
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

// --------- DB CONNECTION ----------
let isDbConnected = false;

async function initDB() {
  if (!isDbConnected) {
    await mongoConn();
    isDbConnected = true;
    console.log("MongoDB connected (serverless)");
  }
}

// Vercel cold start
await initDB();

// --------- EXPRESS ----------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);
app.use(
  cors({
    origin: origins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Accept",
      "X-Requested-With",
      "Authorization",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------- ROUTES ----------
app.use("/auth", authRoutes);
app.use("/", routes);

// Health test
app.get("/", (req, res) => {
  res.json({ status: "API OK on Vercel" });
});

// --------- EXPORT ----------
export const handler = serverless(app);
export default handler;
