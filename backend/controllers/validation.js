const joi = require('joi');

const registerValidation = (data) =>{
    const schema = joi.object({
       username: joi.string().alphanum().min(3).max(20).required(),
       email: joi.string().email().required(),
       password: joi.string().min(8).max(15).required()
    })
    return schema.validate(data);
}
module.exports = {registerValidation};