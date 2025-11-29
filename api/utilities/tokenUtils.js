import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const env = process.env.NODE_ENV || 'dev';
const access = env === 'dev' ? String(process.env.ACCESS_EXP_DEV) : String(process.env.ACCESS_EXP_LIVE);
const refresh = env === 'dev' ? String(process.env.REFRESH_EXP_DEV) : String(process.env.REFRESH_EXP_LIVE);

export const generateAccessToken = (user) => {
    return jwt.sign({ sessacc: user._id }, process.env.JWT_ACCESS_SECRTKEY, { expiresIn: `${access}m` });
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ sessacc: user._id }, process.env.JWT_REFRESH_SECRTKEY, { expiresIn: `${refresh}d` });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRTKEY);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRTKEY);
};
