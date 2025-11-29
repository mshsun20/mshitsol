import express from 'express';
import os from 'os';
import cluster from 'cluster';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoConn from './db/dbcon.js';
import authRoutes from './routes/authRoute.js';
import routes from './routes/route.js';

// Load environment variables from .env file
dotenv.config({ quiet: true });

// Determine the number of worker processes to spawn
const numCPUs = Math.ceil(os.cpus().length / Math.ceil(os.cpus().length / 2)); // Use half of the available CPUs

const app = express();
const apienv = process.env.NODE_ENV || 'dev';
const appenv = process.env.APP_ENV || 'quality';

const portDetails = {
  quality: process.env.PORT_QAS || 5502,
  production: process.env.PORT_PRD || 5501,
}
const port = portDetails[appenv] || 5502;

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


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} running...`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();
}
else {
  (async () => {
    await mongoConn();

    // Express middlewares ...
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

    app.use('/api/auth', authRoutes);
    app.use('/api', routes);

    app.listen(port, () => {
      console.log(`Worker ${process.pid} running Next.js + Express on port ${port}`);
    });
  })();
}
