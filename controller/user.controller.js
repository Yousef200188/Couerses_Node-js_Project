const asyncWrapper = require('../middleware/asyncWrapper');
const { findOne } = require('../models/courses.model');
const user = require('../models/user.model');
const AppError = require('../utilits/appError');
const httStatus = require('../utilits/httpStatus');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const generatejwt = require('../utilits/generatejwt')


const getAllUser = asyncWrapper(async (req, res, next) => {
    const q = req.query;
    const limit = q.limit || 10;
    const page = q.page || 1;
    const skip = (page - 1) * limit;
    const data = await user.find({}, { __v: false, 'password': false }).limit(limit).skip(skip);
    if (!data) {
        const error = AppError.create("course not found", 404, httStatus.ERROR)
        return next(error)
    }
    return res.status(200).json({ status: httStatus.SUCCESS, data: { users: data } })
})
const registerUser = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    const oldUser = await user.findOne({ email: email })
    if (oldUser) {
        const error = AppError.create("this email already exist", 400, httStatus.ERROR)
        return next(error)
    }
    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new user({
        firstName,
        lastName,
        email,
        password: hashPassword,
        role,
        avatar: req.file.filename
    })
    const token = await generatejwt({ email: newUser.email, id: newUser._id, role: newUser.role });
    newUser.token = token;
    await newUser.save()
    return res.status(200).json({ status: httStatus.SUCCESS, data: { user: newUser } })
})



const loginUser = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        const error = AppError.create("email and password are require", 400, httStatus.ERROR)
        return next(error)
    }
    const use = await user.findOne({ email })
    if (!use) {
        const error = AppError.create("User not found", 404, httStatus.FAILL)
        return next(error)
    }
    const matchedPassword = await bcrypt.compare(password, use.password)
    if (use && matchedPassword) {
        const token = await generatejwt({ email: use.email, id: use._id, role: use.role });
        return res.status(200).json({ status: httStatus.SUCCESS, data: { token } })
    } else {
        const error = AppError.create("somthing wrong", 500, httStatus.ERROR)
        return next(error)

    }

})
module.exports = {
    getAllUser,
    registerUser,
    loginUser
}