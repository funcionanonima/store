'use strict'

const _ = require('underscore')
const log = require('./../../../utils/logger')
const users = require('./../../database').users
const bcrypt = require('bcrypt')

module.exports = (username, password, done) => {
    let index = _.findIndex(users, user => user.username === username)
    if(index=== -1){
        log.info(`usuario ${username} no existe. No pudo ser identificado`)
        done(null, false)
        return
    }else{
        let hashedpassword = users[index].password
        bcrypt.compare(password, hashedpassword, (err, success) => {
            if(success){
                log.info(`Usuario ${username} completo autenticacion`)
                done(null, true)
            }else{
                log.info(`Usuario ${username} no completo autenticacion. Contraseña incorrecta`)
                done(null, false)
            }
        })
    }
}