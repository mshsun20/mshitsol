import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoConn from './db/dbcon.js';
import authRoutes from "./routes/authRoute.js";
import routes from "./routes/route.js";

dotenv.config({ quiet: true });

const apienv = process.env.NODE_ENV || 'dev';
const appenv = process.env.APP_ENV || 'quality';

const allowedOrigins = {
  dev: {
    quality: [process.env.APP_URL_DEVQ],
    production: [process.env.APP_URL_DEVP]
  },
  live: {
    quality: [process.env.APP_URL_LIVQ],
    production: [process.env.APP_URL_LIVP]
  }
}
const origins = allowedOrigins[apienv][appenv] || ['http://localhost:3502'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();


// ------------------ MIDDLEWARES ------------------

app.set("trust proxy", "loopback");
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json({ limit: '10000mb' }));
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));
app.use(express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/', routes);

// Health check
await mongoConn();

// ------------------ EXPORT ------------------
export default app;
