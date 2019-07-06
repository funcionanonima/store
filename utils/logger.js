'use strict'
const winston = require('winston')

module.exports = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(msg => `[${msg.timestamp}] ${msg.level}: ${msg.message}`)
        ),
    transports:[
        new winston.transports.File({
            level: 'silly',
            handleExceptions: true,
            maxsize:5120000, // 5 MB,
            maxFiles: 5,
            format: winston.format.combine(
                winston.format.colorize({message: true}),
            ),
    filename: `${__dirname}/../logs/logs-de-aplicacion.log`,
    }),

    new winston.transports.Console({
            level: 'debug',
            handleExceptions: false
        })   
    ],
})