const express = require('express')
const router = express.Router()

const controllerAdmin = require('../controllers/controllerAdmin')
const upload = require('../fileMiddleware/upload')
const { adminAccess } = require('../utils/permissions')

router.post('/addFile', adminAccess, upload.array('myFile[]'), controllerAdmin.addFile)

module.exports = router
