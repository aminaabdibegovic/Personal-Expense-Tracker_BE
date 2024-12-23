const joi = require('joi');

const registerValidation = (data) =>{
    const schema = joi.object({
       username: joi.string().alphanum().min(3).max(20).required(),
       email: joi.string().email().required(),
       password: joi.string().min(8).max(15).required()
    })
    return schema.validate(data);
}

const expenseValidation = (data) =>{
    const schema = joi.object({
        title: joi.string().regex(/^[a-zA-Z]+$/).required(),
        amount: joi.number()
        .precision(2)  
        .required(),
        category: joi.string().regex(/^[a-zA-Z]+$/).required(),
        expenseDate: joi.date().iso().required()
    })
}

module.exports = {registerValidation, expenseValidation};