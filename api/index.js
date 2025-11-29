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

// Load environment variables
dotenv.config({ quiet: true });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// -------- ENV SETTINGS ----------
const apienv = process.env.NODE_ENV || "dev";        // dev/live
const appenv = process.env.APP_ENV || "quality";     // quality/production
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
const origins = allowedOrigins?.[apienv]?.[appenv] || [
  "http://localhost:3502",
];

// --------- DB CONNECTION (Serverless Safe) ----------
let isDbConnected = false;
async function initDB() {
  if (!isDbConnected) {
    await mongoConn();
    isDbConnected = true;
    console.log("✅ MongoDB connected (serverless)");
  }
}
// Ensure DB connects for every cold start
await initDB();


// --------- EXPRESS MIDDLEWARES ----------
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
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
app.use(bodyParser.json({ limit: "10000mb" }));
app.use(bodyParser.urlencoded({ limit: "10000mb", extended: true }));
// Static uploads folder (still works on Vercel)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ---------- API ROUTES ----------
app.use("/auth", authRoutes); // becomes /api/auth on production
app.use("/", routes);         // becomes /api/... auto prefixed by vercel

// test routes
app.get("/", (req, res) => {
  res.json({ status: "API is running on Vercel serverless 🎉" });
});



// --------- EXPORT SERVERLESS HANDLER ----------
export const handler = serverless(app);
export default handler;
