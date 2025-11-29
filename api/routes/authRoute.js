import express from 'express';
const router = express.Router();
import AuthController from '../controllers/authController.js';


// Utility function to create routes
const createRoute = (method, path, ...handlers) => {
    router.route(path)[method](...handlers);
};

// POST
const postRoutes = [
    { path: '/login', handlers: [AuthController.loginUser] },
    { path: '/refresh', handlers: [AuthController.refreshToken] },
    { path: '/logout', handlers: [AuthController.logoutUser] },
];
postRoutes.forEach(route => createRoute('post', route.path, ...route.handlers));

// GET
const getRoutes = [
    { path: '/session', handlers: [AuthController.checkSession] }
];
getRoutes.forEach(route => createRoute('get', route.path, ...route.handlers));


export default router;