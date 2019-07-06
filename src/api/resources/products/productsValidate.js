'use strict'

//crea BLUEPRINTS O PLANOS de los modelos para validar
const Joi = require('joi')

//Crear plano para usar en la validacion
const bluePrintProduct = Joi.object().keys({
    title: Joi.string().max(100).required(),
    price: Joi.number().positive().precision(2).required(),
    denomination: Joi.string().length(3).uppercase()
})

// !! MIDDLEWARE nexttt() !! validar datos que se pasan por el request
module.exports = (req, res, next) => {   
    let result = Joi.validate(req.body, bluePrintProduct, {abortEarly:false, convert:false})
    if(result.error === null){
        next()
    }else{
        let validationErrors = result.error.details.reduce((acumulator, error) => {
            return acumulator + `[${error.message}]`
        }, "")
        res.status(404).send(`Errores: ${validationErrors}`)
    }
}