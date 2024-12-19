const httStatus = require('../utilits/httpStatus');
const mongoose = require('mongoose');
let courses = require('../models/courses.model');
const { ObjectId } = mongoose.Types;
const { validationResult } = require('express-validator');
const asyncWrapper = require('../middleware/asyncWrapper');
const AppError = require('../utilits/appError')
const express = require('express');

const getCourse = async (req, res, next) => {
    const q = req.query;
    const limit = q.limit || 10;
    const page = q.page || 1;
    const skip = (page - 1) * limit;
    const data = await courses.find({}, { __v: false }).limit(limit).skip(skip);
    if (!data) {
        const error = AppError.create("course not found", 404, httStatus.ERROR)
        return next(error)
    }
    return res.status(200).json({ status: httStatus.SUCCESS, data: { courses: data } });


}

const getCourseId = asyncWrapper(async (req, res, next) => {

    const courseId = req.params.id;
    const data = await courses.findById(courseId);
    if (!data) {
        const error = AppError.create("course not found", 404, httStatus.ERROR)
        return next(error)
    }
    return res.status(200).json({ status: httStatus.SUCCESS, data: { course: data } });
})

const addCourse = asyncWrapper(async (req, res, next) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
        const error = AppError.create("course not found", 404, httStatus.ERROR);
        return next(error);
    }
    const data = new courses(req.body);
    await data.save();
    return res.status(200).json({ status: httStatus.SUCCESS, data: { course: data } });
});


const updateCourse = async (req, res) => {
    const courseid = req.params.id;
    const data = await courses.findByIdAndUpdate(courseid, { $set: { ...req.body } })
    if (!data) {
        const error = AppError.create("course not found", 404, httStatus.ERROR)
        return next(error)
    }
    return res.status(200).json({ status: httStatus.SUCCESS, data: { course: data } });
}




const deleteCourse = async (req, res) => {
    const courseId = req.params.id;
    const data = await courses.findOneAndDelete({ _id: ObjectId(courseId) });
    if (!data) {
        const error = AppError.create("course not found", 404, httStatus.ERROR)
        return next(error)
    }

    return res.status(200).json({ status: httStatus.SUCCESS, data: null })

};

module.exports = {
    getCourse,
    getCourseId,
    updateCourse,
    addCourse,
    deleteCourse
}