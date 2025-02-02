'use strict'

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const productsRouter = require('./api/resources/products/productsRoutes')
const usersRouter = require('./api/resources/users/usersRoutes')
const logger = require('./../utils/logger')
const colors = require('colors')
const auth = require('./api/libs/auth')


const passport = require('passport')
//BasicStrategy metodo simple de autenticacion de logeo de passport
const BasicStrategy = require('passport-http').BasicStrategy
//passprot hace todo econ el servicio de BASIC STARTEGY
passport.use(new BasicStrategy(auth))

//Instancia exress, bodyparser, morgan
const app = express()
app.use(bodyParser.json())
app.use(morgan('dev', {
    stream:{
        write: message => logger.info(message.trim())
    }
}))

//usar passport
app.use(passport.initialize())

//Rutas
app.use('/api/products', productsRouter)
app.use('/users', usersRouter)

app.get('/', passport.authenticate('basic', {session:false}), (req, res) => {
    res.send('API de Productos')
})

//Server
app.listen(3000, () => {
    console.log('Corriendo server'.yellow)
})
