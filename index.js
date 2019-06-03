'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
//id universal unico
const uuidv4 = require('uuid/v4')
const _ = require('underscore')

const app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))

// database
const products = [
    {id: '212', title: 'osospolar', price: '999'},
    {id: '12', title: 'morsa', price: '99'},
    {id: '2', title: 'osogrizle', price: '919'}
]

app.route('/products')
    .get((req, res) => {
        res.json(products)
    })
    .post((req, res) => {
        let newProduct = req.body
        if(!newProduct.price || !newProduct.title){
            //Bad request
            res.status(404).send("Input invalido")
            return
        }
        newProduct.id = uuidv4()
        products.push(newProduct)
        res.status(201).json(newProduct)
    })

app.route('/products/:id')
    .get((req, res) => {
    for (let product of products){
        if(product.id == req.params.id){
            res.json(product)
            return
        }
    }
        //not found
        res.status(404).send(`El producto con Id ${req.params.id}, no se encuentra`)
    })
    .put((req, res) => {
        let id = req.params.id
        let updProduct = req.body        

        if(!updProduct.price || !updProduct.title){
            //Bad request
            res.status(404).send("Input invalido")
            return
        }

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

app.get('/', (req, res) => {
    res.send('api de storeZ')
})

app.listen(3000, () => {
    console.log('Corriendo server')
})