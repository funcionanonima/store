'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const productsRouter = require('./api/resources/products/productsRoutes')
const logger = require('./../utils/logger')
const colors = require('colors')

//Instancia exress, bodyparser, morgan
const app = express()
app.use(bodyParser.json())
app.use(morgan('dev', {
    stream:{
        write: message => logger.info(message.trim())
    }
}))

//Rutas
app.use('/api/products', productsRouter)

//Server
app.listen(3000, () => {
    console.log('Corriendo server'.yellow)
})
