import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const dbUrl = process.env.ONLN_DBURL
const appenv = process.env.APP_ENV || 'quality';
const env = process.env.NODE_ENV || 'dev';

const dbnm = appenv === 'production'
    ? (env === 'live' ? (console.log('Live (Production Server)'), 'mshitsolprddb') : (console.log('Dev (Production Server)'), 'mshitsoldb'))
    : (env === 'live' ? (console.log('Live (Quality Server)'), 'mshitsolqasdb') : (console.log('Dev (Quality Server)'), 'mshitsoldb'));


mongoose.set('strictQuery', false); // Disable strict query mode

const mongoConn = async () => {
    try {
        await mongoose.connect(dbUrl, {
            dbName: dbnm,
            retryWrites: true,
            w: 'majority',
            ssl: true,
            maxPoolSize: 1, // Keep per-worker connections low
            minPoolSize: 1
        });
        console.log(`Worker ${process.pid}: DB Successfully Connected...`);
    } catch (error) {
        console.error(error);
        throw new Error('Database connection failed');
    }
}

export default mongoConn;