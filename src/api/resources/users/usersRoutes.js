'use strict'

const express = require('express')
//uto underscore
const _ = require('underscore')
//id universal unico
const uuidv4 = require('uuid/v4')
//bcrypt
const bcrypt = require('bcrypt')
//jwt
const jwt = require('jsonwebtoken')

//traer el middleware
const validateUsers = require('./usersValidate').usersValidate
const validateLogin = require('./usersValidate').usersLoginValidate
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
            id: uuidv4(),
            username: newuser.username,
            email: newuser.email,
            password: hashedPassword
        })
        res.status(201).send('Usuario creado existosamente')
    })
})

usersRouter.post('/login', validateLogin, (req, res) => {
    let userunauth = req.body
    let index = _.findIndex(users, user => user.username === userunauth.username)
    if(index=== -1){
        log.info(`usuario ${userunauth.username} no existe. No pudo ser identificado`)
        res.status(400).send(`Credenciales incorrectas, el usuario no existe`)
        return
    }else{
        let hashedpassword = users[index].password
        bcrypt.compare(userunauth.password, hashedpassword, (err, success) => {
            if(success){
                //generar y enviar tokenn
                let token = jwt.sign({
                    //argumentos a pasarle altoken
                    id: users[index].id
                    //secreto para descifrar jwt
                }, 'aSecret', {
                    //tiempo expiracion
                    expiresIn:86400
                })
                log.info(`Usuario no identificado ${userunauth.username} completo autenticacion exitosamente`)
                //retorn el token generado
                res.status(200).json({token})
            }else{
                log.info(`Usuario ${userunauth.username} no completo autenticacion. Contraseña incorrecta`)
                res.status(400).send('Credenciales incorrectas')
            }
        })
    }
})

module.exports = usersRouter