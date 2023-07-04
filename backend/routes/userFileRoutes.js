const express = require('express')
const  controllerUser= require('../controllers/controllerUser')
const {userAccess} = require('../utils/permissions')
const router = express.Router()

router.get('/findfile',userAccess,controllerUser.findAllFiles);
router.get ('/fileTitle',userAccess,controllerUser.findFiletitle);

module.exports = router;