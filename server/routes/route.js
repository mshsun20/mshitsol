const express = require('express')
const router = express.Router()
const session = require('express-session')
const AdmController = require('../controllers/admCntrlr')
const UsrController = require('../controllers/usrCntrlr')
const AdmauthMiddleware = require('../middlewares/admauthMidware')
const UsrauthMiddleware = require('../middlewares/usrauthMidware')
const SrvcController = require('../controllers/srvcCntrlr')
const PlnController = require('../controllers/plnCntrlr')
const FeatrController = require('../controllers/featrCntrlr')
const CntrymController = require('../controllers/cntrymCntrlr')
const CurmController = require('../controllers/curmCntrlr')


// ping check
// ________________________________________________________________
// ----------------------------------------------------------------
router.route('/').get((req, res) => {
    res.json({message:`Server is Live...`, statuscode:200})
})
router.route('/chckstat').get((req, res) => {
    res.json({message:`Server is Online Now...`, statuscode:200})
})
// ________________________________________________________________
// ----------------------------------------------------------------


// get
// ________________________________________________________________
// ----------------------------------------------------------------
// admin
router.route('/admin/sess/:tokn').get(AdmauthMiddleware, AdmController.sess)
router.route('/admin/logout').get(AdmController.logout)
router.route('/usrs/fetch').get(UsrController.read)
router.route('/usr/fetch/:id').get(UsrController.readOne)
router.route('/srvcs/fetch').get(SrvcController.read)
router.route('/plns/fetch').get(PlnController.read)
router.route('/featrs/fetch').get(FeatrController.read)
router.route('/cntryms/fetch').get(CntrymController.read)
router.route('/cntryms/retrieve/:id').get(CntrymController.retrieve)
router.route('/currms/fetch').get(CurmController.read)
router.route('/currms/retrieve/:id').get(CurmController.retrieve)

// client
router.route('/user/sess/:tokn').get(UsrauthMiddleware, UsrController.sess)
router.route('/user/logout').get(UsrController.logout)



// post
// ________________________________________________________________
// ----------------------------------------------------------------
// admin
router.route('/admin/create').post(AdmController.create)
router.route('/admin/login').post(AdmController.login)
router.route('/admin/resetpass').post(AdmController.resetpass)
router.route('/admin/cnfcode').post(AdmController.cnfcode)
router.route('/srvc/create').post(SrvcController.create)
router.route('/featr/create').post(FeatrController.create)
router.route('/pln/create').post(PlnController.create)
router.route('/cntrym/create').post(CntrymController.create)
router.route('/cntrym/upload').post(CntrymController.upload)
router.route('/currm/create').post(CurmController.create)
router.route('/currm/upload').post(CurmController.upload)
router.route('/faq/create').post(SrvcController.create)

// client
router.route('/user/create').post(UsrController.create)
router.route('/user/login').post(UsrController.login)
router.route('/user/resetpass').post(UsrController.resetpass)
router.route('/user/cnfcode').post(UsrController.cnfcode)




// put
// ________________________________________________________________
// ----------------------------------------------------------------
// admin
router.route('/admin/pass/update/:id').post(AdmController.chngpass)
router.route('/cntrym/update/:id').put(CntrymController.update)
router.route('/currm/update/:id').put(CurmController.update)

// client
router.route('/user/pass/update/:id').post(UsrController.chngpass)



// delete
// ________________________________________________________________
// ----------------------------------------------------------------
// admin
router.route('/usr/remove/:id').delete(UsrController.delete)
router.route('/cntrym/remove/:id').delete(CntrymController.delete)
router.route('/currm/remove/:id').delete(CurmController.delete)

// client




module.exports = router