// /api/index.js
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

// ------------------ DB CONNECTION MIDDLEWARE ------------------
let isDbConnected = false;

app.use(async (req, res, next) => {
  if (!isDbConnected) {
    try {
      await mongoConn();
      isDbConnected = true;
      console.log("✅ MongoDB connected (serverless)");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// ------------------ EXPRESS MIDDLEWARES ------------------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

const allowedOrigins = [
  process.env.APP_URL_DEVQ,
  process.env.APP_URL_DEVP,
  process.env.APP_URL_LIVQ,
  process.env.APP_URL_LIVP,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ ROUTES ------------------
app.use("/auth", authRoutes);
app.use("/", routes);

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "API OK on Vercel" });
});

// ------------------ SERVERLESS EXPORT ------------------
export default serverless(app);
