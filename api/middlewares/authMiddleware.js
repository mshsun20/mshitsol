import accModel from "../models/accModel.js";
import { verifyAccessToken } from "../utilities/tokenUtils.js";

const username = process.env.APP_API_USR || 'digitalapi'
const password = process.env.APP_API_PSS || 'Shyam@12345'

export const basicAuth = async (req, res, next) => {
    const method = req.method;
    const contentType = req.headers['content-type'] || '';
    const accept = req.headers['accept'] || '';
    const xRequestedWith = req.headers['x-requested-with'] || '';
    const authHeader = req.headers.authorization;

    // ✅ All headers checks
    if (
        !accept.toLowerCase().includes('application/json') ||
        xRequestedWith.toLowerCase() !== 'x' ||
        (['POST', 'PUT', 'PATCH'].includes(method) && !contentType.toLowerCase().includes('application/json'))
    ) {
        return res.status(401).json({ message: 'Invalid or missing headers', statuscode: 401 });
    }

    // ✅ Authorization must be present
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing!', statuscode: 401 });
    }

    const [scheme, credentials] = authHeader.split(' ');
    if (scheme !== 'Basic' || !credentials) {
        return res.status(401).json({ message: 'Invalid authorization format!', statuscode: 401 });
    }

    // ✅ Decode credentials
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [user, pass] = decodedCredentials.split(':');
    
    const adminDtl = await accModel.findOne({ acc_uname: "smetalics1" })
        .populate([ 'acc_typ', 'createdby', 'updatedby' ]).lean();

    // ✅ Compare against actual env values
    if (user === username && pass === password) {
        req.user = adminDtl; // Dummy user ID for basic auth
        return next();
    } else {
        return res.status(403).json({ message: 'Forbidden ..!', statuscode: 403 });
    }
};


export const jwtHybrdProtect = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Not authorized', statuscode: 401 });

    try {
        const decoded = verifyAccessToken(token);
        if (!decoded || !decoded.sessacc) {
            return res.status(403).json({ message: 'Invalid token', statuscode: 403 });
        }
        const userDtl = await accModel.findById(decoded.sessacc)
            .select(['-acc_pass', '-acc_pass_bckup', '-acc_typ', '-createdby'])
            .populate([ 'acc_typ', 'createdby', 'updatedby' ])
            .lean();
        req.user = userDtl;
        next();
    } catch {
        res.status(403).json({ message: 'Invalid or expired token', statuscode: 403 });
    }
};