import joi from "@hapi/joi"
const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));


const authSchem = joi.object({

    username: joi.string().min(2).max(18).regex(/^[a-z-A-Z][A-Z-a-z-0-9][^<>,*,(),{},[,\s]+$/).required(),
    lastname: joi.string().min(3).max(20).regex(/^[A-Z-a-z]+$/).required(),
    email: joi.string().email().max(30).lowercase().regex(/^\S+@\S+\.\S+$/).required(),
    password: joi.string().min(6).max(22).regex(/^\S+$/).required(),
    male: joi.string().required(),
    single: joi.string().regex(/^[A-Z-a-z]+$/).allow(""),
    from: joi.string().min(2).max(25).regex(/^[A-Z-a-z]+$/).allow(""),
    city: joi.string().min(3).max(25).regex(/^[A-Z-a-z]+$/).allow(""),
    job: joi.string().min(3).max(40).regex(/^[A-Z-a-z]+$/).allow(""),
    scool: joi.string().min(3).max(30).regex(/^[A-Z-a-z]+$/).allow(""),
    age: joi.string().min(0).max(100).allow(""),
    phone: joi.string().regex(/^[0-9]{5,15}$/).allow(""),
    birthDay: joi.string().max(10).allow(""),
    notificationBirthday: joi.string().max(10).allow(""),
    passwordAgain: Joi.string().required().valid(Joi.ref('password')),

})

export default authSchem