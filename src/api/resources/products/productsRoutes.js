'use strict'

const express = require('express')
//uto underscore
const _ = require('underscore')
//id universal unico
const uuidv4 = require('uuid/v4')
//traer el middleware
const validateProduct = require('./productsValidate')

const products = require('./../../../database').products
const productsRouter = express.Router()

//Metodos HTTP para las rutas RESt
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