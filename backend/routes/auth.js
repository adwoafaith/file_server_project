const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController')

// router.post('/register',userRegistration.register);
// router.get('/signUp',userRegistration.sign_up)
// router.get('/login',userRegistration.Login)
// router.post('/login',userRegistration.login)
// router.post('/fogotPassword',userRegistration.forgotPassword)
// //router.patch('/resetPassword/:token',userRegistration.resetPassword)
router.get('/signup',authController.signup_get)
router.post('/signup',authController.signup_post)
router.get('/login',authController.login_post)
router.post('/login',authController.login)
module.exports = router;