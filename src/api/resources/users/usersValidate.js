'use strict'

const Joi = require('joi')
const log = require('./../../../../utils/logger')

const bluePrintUser = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(3).required(),
    password: Joi.string().min(6).max(200).required(),
    email: Joi.string().email().required()
})

module.exports = (req, res, next) =>{
    const result = Joi.validate(req.body, bluePrintUser, {abbortEearly: false, convert: false})
    if(result.error === null){
        next()
    }else{
        log.info("Usuario falló la validacion", result.error.details)
        res.status(400).send("Paila, nada")
    }
}