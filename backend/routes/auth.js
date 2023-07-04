const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController')

router.post('/signup',authController.signup_post)
router.post('/login',authController.login)
router.post('/fogotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)

module.exports = router;