const express = require('express')
const  controllerUser= require('../controllers/controllerUser')
const {userAccess, adminAccess} = require('../utils/permissions')
const router = express.Router()

router.get('/findfile', userAccess, controllerUser.findAllFiles);
router.get ('/fileTitle', userAccess,controllerUser.findFiletitle);
router.post('/sendEmail/:id', userAccess, controllerUser.sendEmail);
router.get('/:id', userAccess,  controllerUser.downloadFile);


module.exports = router;