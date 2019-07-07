'use strict'

const express = require('express')
//uto underscore
const _ = require('underscore')
//id universal unico
const uuidv4 = require('uuid/v4')
//bcrypt
const bcrypt = require('bcrypt')

//traer el middleware
const validateUsers = require('./usersValidate')
const log = require('./../../../../utils/logger')
const users = require('./../../../database').users

const usersRouter = express.Router()

usersRouter.get('/', (req, res) => {
    res.json(users)
})

usersRouter.post('/', validateUsers, (req, res) => {
    let newuser = req.body
    //valida que no se ingresen usuarios con email o user existentes
    let index = _.findIndex(users, user => {
        return user.username === newuser.username || user.email === newuser.email
    })
    if(index !== -1){
        log.info('email o User existentes')
        //409 conflicto
        res.status(409).send('email o User existentes')
        return
    }
    //hasear password user
    bcrypt.hash(newuser.password, 10, (err, hashedPassword) => {
        if(err){
            log.error('Error ocurrió al intentantar obtener hash de la password', err)
            res.status(500).send('Ocurrió error procesando creacion del usuario')
            return
        }
        users.push({
            username: newuser.username,
            email: newuser.email,
            password: hashedPassword
        })
        res.status(201).send('Usuario creado existosamente')
    })
})

module.exports = usersRouter