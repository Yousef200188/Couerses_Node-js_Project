const express = require('express');
const router = express.Router();
const coursesController = require('../controller/course.controller');
const userRole = require('../utilits/user_role');
const verifyToken = require('../middleware/verfiyToken');
const allowTo = require('../middleware/allowTo')


router.get('/', coursesController.getCourse)
router.get('/:id', coursesController.getCourseId)
router.post('/', coursesController.addCourse)
router.put('/:id', coursesController.updateCourse)
router.delete('/:id', verifyToken, allowTo(userRole.ADMIN, userRole.MANGER), coursesController.deleteCourse)


module.exports = router;