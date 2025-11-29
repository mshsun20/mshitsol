import express from 'express';
import { basicAuth, jwtHybrdProtect } from '../middlewares/authMiddleware.js';
const router = express.Router();
import fileUpload from '../middlewares/fileUpload.js';

import leadController from '../controllers/enquirymodules/leadController.js';

import acctypController from '../controllers/masters/accsetups/acctypController.js';
import cmpnyController from '../controllers/masters/admin/cmpnyController.js';
import sttController from '../controllers/masters/admin/sttController.js';
import untController from '../controllers/masters/admin/untController.js';
import subcatController from '../controllers/masters/enquirysetups/subcatController.js';
import prodController from '../controllers/masters/enquirysetups/prodController.js';

import accController from '../controllers/accController.js';
import funcController from '../controllers/adminmgmt/function/funcController.js';
import dynapprvlController from '../controllers/adminmgmt/dynapproval/dynapprvlController.js';
import fileOpController from '../controllers/fileOpController.js';




// Utility function to create routes
const createRoute = (method, path, ...handlers) => {
    router.route(path)[method](...handlers);
};

// PING
createRoute('get', '/', (_, res) => res.status(200).json({ message: 'Server is Live...' }));
createRoute('get', '/chckstat', (_, res) => res.status(200).json({ message: 'Server is Online Now...' }));

// POST
const postRoutes = [
    { path: '/lead/create',
        handlers: [
            basicAuth,
            fileUpload.none(),
            leadController.create
        ]
    },
    { path: '/acctyp/create', handlers: [jwtHybrdProtect, fileUpload.none(), acctypController.create] },
    { path: '/cmpny/create', handlers: [jwtHybrdProtect, fileUpload.none(), cmpnyController.create] },
    { path: '/stt/create', handlers: [basicAuth, fileUpload.none(), sttController.create] },
    { path: '/unt/create', handlers: [jwtHybrdProtect, fileUpload.none(), untController.create] },
    { path: '/subcat/create', handlers: [basicAuth, fileUpload.none(), subcatController.create] },
    { path: '/prod/create', handlers: [basicAuth, fileUpload.none(), prodController.create] },
    { path: '/acc/create', handlers: [jwtHybrdProtect, fileUpload.none(), accController.create] },
    { path: '/acc/import', handlers: [basicAuth, fileUpload.none(), accController.upload] },
    { path: '/func/create', handlers: [basicAuth, fileUpload.none(), funcController.create] },
    { path: '/dynapprvl/create', handlers: [jwtHybrdProtect, fileUpload.none(), dynapprvlController.create] },
    // { path: '/mail/send', handlers: [basicAuth, fileUpload.none(), mailtestController.send] },
];
postRoutes.forEach(route => createRoute('post', route.path, ...route.handlers));

// GET
const getRoutes = [
    { path: '/lead/fetch', handlers: [basicAuth, leadController.read] },
    { path: '/acctyp/fetch', handlers: [jwtHybrdProtect, acctypController.read] },
    { path: '/acctyp/fetchby/:id', handlers: [jwtHybrdProtect, acctypController.readById] },
    { path: '/acctyp/fetchuppr', handlers: [jwtHybrdProtect, acctypController.readLowrHierarchy] },
    { path: '/cmpny/fetch', handlers: [jwtHybrdProtect, cmpnyController.read] },
    { path: '/stt/fetch', handlers: [basicAuth, sttController.read] },
    { path: '/unt/fetch', handlers: [basicAuth, untController.read] },
    { path: '/subcat/fetch', handlers: [basicAuth, subcatController.read] },
    { path: '/prod/fetch', handlers: [basicAuth, prodController.read] },
    { path: '/acc/fetch', handlers: [basicAuth, accController.read] },
    { path: '/acc/fetchby/:id', handlers: [basicAuth, accController.readById] },
    { path: '/acc/fetchuppr/:acctypid', handlers: [basicAuth, accController.readLowrHierarchy] },
    { path: '/func/fetch', handlers: [basicAuth, funcController.read] },
    { path: '/dynapprvl/fetch', handlers: [basicAuth, dynapprvlController.read] },
    { path: '/file/download/:id', handlers: [jwtHybrdProtect, fileOpController.downloadHandler] },
    { path: '/file/downloadall', handlers: [jwtHybrdProtect, fileOpController.downloadAllHandler] },
];
getRoutes.forEach(route => createRoute('get', route.path, ...route.handlers));

// PUT
const putRoutes = [
    { path: '/lead/update',
        handlers: [
            basicAuth,
            fileUpload.none(),
            leadController.update
        ]
    },
    // { path: '/lead/status/update', handlers: [ jwtHybrdProtect, fileUpload.none(), leadController.statusUpdate ] },
    { path: '/acctyp/update', handlers: [jwtHybrdProtect, fileUpload.none(), acctypController.update] },
    { path: '/cmpny/update', handlers: [jwtHybrdProtect, fileUpload.none(), cmpnyController.update] },
    { path: '/stt/update', handlers: [basicAuth, fileUpload.none(), sttController.update] },
    { path: '/unt/update', handlers: [jwtHybrdProtect, fileUpload.none(), untController.update] },
    { path: '/subcat/update', handlers: [basicAuth, fileUpload.none(), subcatController.update] },
    { path: '/prod/update', handlers: [basicAuth, fileUpload.none(), prodController.update] },
    { path: '/acc/update', handlers: [jwtHybrdProtect, fileUpload.none(), accController.update] },
    { path: '/func/update', handlers: [jwtHybrdProtect, fileUpload.none(), funcController.update] },
    { path: '/dynapprvl/update/:id', handlers: [jwtHybrdProtect, fileUpload.none(), dynapprvlController.update] },
    { path: '/dynapprvl/statusupdt/:id', handlers: [jwtHybrdProtect, fileUpload.none(), dynapprvlController.statusUpdt] },
];
putRoutes.forEach(route => createRoute('put', route.path, ...route.handlers));

// DELETE
const deleteRoutes = [
    { path: '/lead/delete', handlers: [jwtHybrdProtect, leadController.remove] },
    { path: '/acctyp/delete', handlers: [jwtHybrdProtect, acctypController.remove] },
    { path: '/dynapprvl/delete/:id', handlers: [jwtHybrdProtect, dynapprvlController.remove] },
    { path: '/cmpny/delete', handlers: [jwtHybrdProtect, cmpnyController.remove] },
    { path: '/stt/delete', handlers: [basicAuth, sttController.remove] },
    { path: '/unt/delete', handlers: [jwtHybrdProtect, untController.remove] },
    { path: '/subcat/delete', handlers: [basicAuth, subcatController.remove] },
    { path: '/prod/delete', handlers: [basicAuth, prodController.remove] },
    { path: '/acc/delete', handlers: [jwtHybrdProtect, accController.remove] },
    { path: '/func/delete', handlers: [jwtHybrdProtect, funcController.remove] },
];
deleteRoutes.forEach(route => createRoute('delete', route.path, ...route.handlers));

export default router;