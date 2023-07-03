const express = require('express')
const  controllerUser= require('../controllers/controllerUser')
const router = express.Router()

router.get('/findfile',controllerUser.findAllFiles);
router.get ('/fileTitle',controllerUser.findFiletitle);

module.exports = router;