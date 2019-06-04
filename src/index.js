'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const productsRouter = require('./api/resources/products/productsRoutes')

const app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/products', productsRouter)

app.listen(3000, () => {
    console.log('Corriendo server')
})