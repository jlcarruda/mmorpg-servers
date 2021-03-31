require('dotenv').config()

const { initialize } = require('./src/server')

initialize({ port: process.env.PORT, host: process.env.HOST })
