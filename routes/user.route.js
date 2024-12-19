const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller')
const verfiyToken = require('../middleware/verfiyToken')
const multer = require('multer')
const appError = require('../utilits/appError')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const filename = `user_${Date.now()}.${ext}`
        cb(null, filename)
    }
})
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
        return cb(null, true)
    } else {
       return cb(appError.create('file must be an image', 400), false)
    }

}

const upload = multer({
    storage: storage,
    fileFilter
})

router.get('/', verfiyToken, userController.getAllUser)
router.post('/', upload.single('avatar'), userController.registerUser)
router.post('/login', userController.loginUser)

module.exports = router