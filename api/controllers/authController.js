import accModel from "../models/accModel.js";
import sessModel from "../models/sessModel.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utilities/tokenUtils.js";
import { comparePassword } from "../utilities/hashPassword.js";
import dotenv from 'dotenv';
dotenv.config({ quiet: true });


const env = process.env.NODE_ENV || 'dev';
const accessTokenExpiryTTL = env === 'dev'
? parseInt(process.env.ACCESS_EXP_DEV) * 60 * 1000
: parseInt(process.env.ACCESS_EXP_LIVE) * 60 * 1000;
const refreshTokenExpiryTTL = env === 'dev'
? parseInt(process.env.REFRESH_EXP_DEV) * 24 * 60 * 60 * 1000
: parseInt(process.env.REFRESH_EXP_LIVE) * 24 * 60 * 60 * 1000;

const loginUser = async (req, res) => {
    try {
        const { acc_uname, acc_pass, device, location } = req.body;
        const userAgent = req.get('User-Agent');
        const ipAddress = req.ip;

        const user = await accModel.findOne({ acc_uname })
        .populate([ 'acc_typ', 'createdby', 'updatedby' ])
        .lean();
        
        const accValdt = comparePassword(acc_pass, user?.acc_pass);
        if (user && accValdt) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await sessModel.create({
                sessacc: user._id,
                userAgent,
                ipAddress,
                device,
                location,
                refreshToken,
                expiresAt: new Date(Date.now() + refreshTokenExpiryTTL)
            });
            const usrDta = {
                _id: user?._id,
                acc_uname: user?.acc_uname,
                acc_eml: user?.acc_eml,
                acc_phn: user?.acc_phn,
                acc_fname: user?.acc_fname,
                acc_secphn: user?.acc_secphn,
                acc_typ: user?.acc_typ,
                acc_cat: user?.acc_cat,
                acc_comp: user?.acc_comp,
                acc_emp_code: user?.acc_emp_code,
                acc_dept: user?.acc_dept,
                acc_desig: user?.acc_desig,
                acc_reporting: user?.acc_reporting,
                acc_state: user?.acc_state,
                acc_addrss: user?.acc_addrss,
                acc_pan: user?.acc_pan,
                acc_gst: user?.acc_gst,
                acc_img: user?.acc_img,
                acc_img_publicid: user?.acc_img_publicid,
                acc_dob: user?.acc_dob,
                acc_anniversary: user?.acc_anniversary,
                acc_is_creator: user?.acc_is_creator,
                acc_is_approver: user?.acc_is_approver,
                acc_status: user?.acc_status
            }

            res.status(200)
            // .cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'Lax', secure: env === 'live', maxAge: accessTokenExpiryTTL })
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: env === 'live', maxAge: refreshTokenExpiryTTL })
            .json({ message: 'Login successful', statuscode: 200, data: usrDta, accessToken });
        }
        else {
            return res.status(401).json({ message: 'Invalid credentials', statuscode: 401 });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Server error', statuscode: 400 });
    }
};

const checkSession = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: 'Not authenticated', statuscode: 401 });

        const decoded = verifyAccessToken(token);
        const user = await accModel.findById(decoded.sessacc).select(['-acc_pass', '-acc_pass_bckup'])
        .populate([ 'acc_typ', 'createdby', 'updatedby' ])
        .lean();
        if (!user) return res.status(404).json({ message: 'User not found', statuscode: 404 });

        res.status(200).json({ message: 'Session is live', statuscode: 200, data: user });
    } catch (err) {
        return res.status(419).json({ message: 'Session invalid or expired', statuscode: 419 });
    }
};

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No token provided', statuscode: 401 });

    try {
        const decoded = verifyRefreshToken(token);
        const session = await sessModel.findOne({ sessacc: decoded.sessacc, refreshToken: token });
        if (!session) return res.status(419).json({ message: 'Invalid session', statuscode: 419 });

        const newAccessToken = generateAccessToken({ _id: decoded.sessacc });
        res.status(200)
        .cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'Lax', secure: env === 'live', maxAge: accessTokenExpiryTTL })
        .json({ message:'Ok', statuscode: 200, accessToken: newAccessToken });

    } catch {
        res.status(419).json({ message: 'Token expired or invalid', statuscode: 419 });
    }
};

const logoutUser = async (req, res) => {
    const token = req.cookies.refreshToken;
    await sessModel.deleteMany({ refreshToken: token });
    res.status(200).clearCookie('accessToken').clearCookie('refreshToken')
    .json({ message: 'Successfully Logged out', statuscode: 200 });
};

export default {
    loginUser,
    checkSession,
    refreshToken,
    logoutUser
};


