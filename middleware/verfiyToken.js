const jwt = require('jsonwebtoken');
const AppError = require('../utilits/appError')
const httStatus = require('../utilits/httpStatus')

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader) {
            const error = AppError.create("No authorization header provided", 401, httStatus.ERROR)
            return next(error)
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            const error = AppError.create("Token not provided", 401, httStatus.ERROR)
            return next(error)
        }
        const currentUser = jwt.verify(token, process.env.SECRET_KEY);
        req.currentUser = currentUser
        next();
    } catch (err) {
        const error = AppError.create("Invalid token", 403, httStatus.ERROR)
        return next(error)
    }
};

module.exports = verifyToken;
