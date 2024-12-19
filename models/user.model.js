const mongoose= require('mongoose')
const { schema } = require('./courses.model')
const validator = require('validator')
const { validate } = require('moongose/models/user_model')
const userRole = require('../utilits/user_role')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'filed must be a valid email address']


    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:[userRole.USER,userRole.ADMIN,userRole.MANGER],
        default:userRole.USER
    },
    avatar:{
        type:String,
        default:'Uploads/profile.jpeg'
    }
})
module.exports=mongoose.model('User',userSchema)