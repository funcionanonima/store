'use strict'

const Joi = require('joi')
const log = require('./../../../../utils/logger')

const bluePrintUser = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(200).required(),
    password: Joi.string().min(6).max(200).required(),
    email: Joi.string().email().required()
})

let usersValidate = (req, res, next) =>{
    const result = Joi.validate(req.body, bluePrintUser, {abortEarly: false, convert: false})
    if(result.error === null){
        next()
    }else{        
        log.info("Usuario falló la validacion", result.error.details.map(error=> error.message))
        res.status(400).send("Paila, nada")
    }
}

const bluePrintReqLogin = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
})

let usersLoginValidate = (req, res, next) => {
    const result = Joi.validate(req.body, bluePrintReqLogin, {abortEarly:false, convert: false})
    if(result.error === null){
        next()
    }else{
        res.status(400).send("Login falló, debes especificar username y contraseña del usuario")
    }
}

module.exports = {
    usersValidate,
    usersLoginValidate
}