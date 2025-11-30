import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoute.js";
import routes from "./routes/route.js";

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// ------------------ MIDDLEWARES ------------------
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

app.use(bodyParser.json({ limit: '10000mb' }));
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ ROUTES ------------------
app.use("/auth", authRoutes);
app.use("/", routes);

// Health check

// ------------------ EXPORT ------------------
export default app;

// import express from 'express';

// const app = express();

// app.get('/', (req, res) => {
//   res.json({ message: 'API working from Vercel serverless!' });
// });

// app.get('/hello', (req, res) => {
//   res.json({ message: 'Hello from Express on Vercel!' });
// });

// export default app;

