const { Router } = require("express");
const controller = require('../controllers/appControllers');
const { checkAuthorization, localVariables } = require('../middleware/auth');
const { registerMail } = require('../utils/nodeMailer');

const router = Router()

router.route('/register').post(controller.register)
router.route('/registerEmail').post(registerMail)   
router.route('/authenticate').post(controller.verifyUser, (req, res) => {
    res.end();  // Sends the response to the client
});//add verify
router.route('/login').post(controller.verifyUser, controller.login) //add verify


router.route('/user/:username').get(controller.verifyUser, controller.getUser)
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP)

router.route('/authenticate').get(controller.verifyUser, (req, res) => res.end());

router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) //add verify
router.route('/createResetSession').get(controller.createResetSession)

router.route('/updateuser').put(checkAuthorization, controller.updateUser)
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword)

module.exports = router