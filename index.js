'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.get('/', (req, res) => {
    res.send('api de storeZ')
})

app.listen(3000, () => {
    console.log('Corriendo server')
})