'use strict'

const express = require('express')
const _ = require('underscore')
//id universal unico
const uuidv4 = require('uuid/v4')
const Joi = require('joi')

const products = require('./../../../database').products
const productsRouter = express.Router()

const bluePrintProduct = Joi.object().keys({
    title: Joi.string().max(100).required(),
    price: Joi.number().positive().precision(2).required(),
    denomination: Joi.string().length(3).uppercase()
})

const validateProduct = (req, res, next) => {   

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

productsRouter.get('/',(req, res) => {
    res.json(products)
})

productsRouter.post('/', validateProduct, (req, res) => {
    let newProduct = req.body

    newProduct.id = uuidv4()
    products.push(newProduct)
    res.status(201).json(newProduct)
})

productsRouter.post('/:id', (req, res) => {
    for (let product of products){
        if(product.id == req.params.id){
            res.json(product)
            return
        }
    }
        //not found
        res.status(404).send(`El producto con Id ${req.params.id}, no se encuentra`)
    })

productsRouter.put('/:id', validateProduct, (req, res) => {
    let id = req.params.id
    let updProduct = req.body  

    let index = _.findIndex(products, product => product.id == id)
    if(index !== -1){
        //update
        updProduct.id = id
        products[index] = updProduct
        res.status(201).json(updProduct)
    }else{
        res.status(404).send(`El producto con Id ${id}, no se encuentra`)
    }
})

productsRouter.delete('/:id', (req, res) => {
    let delProd = _.findIndex(products, product => product.id == req.params.id)
    if(delProd === -1){
        res.status(404).send(`Producto con id: ${req.params.id} no existe`)
        return
    }
    let deleted = products.splice(delProd, 1)
    res.json(deleted)
})

module.exports = productsRouter