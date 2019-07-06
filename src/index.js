'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const productsRouter = require('./api/resources/products/productsRoutes')

//Instancia exress, bodyparser, morgan
const app = express()
app.use(bodyParser.json())
app.use(morgan('dev'))

//Rutas
app.use('/api/products', productsRouter)

//Server
app.listen(3000, () => {
    console.log('Corriendo server')
})