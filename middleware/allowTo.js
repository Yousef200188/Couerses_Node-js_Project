const appError = require("../utilits/appError")

module.exports = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.currentUser.role)){
            return next(appError.create('this role is not authorized', 401))
        }
        next()
    }
}