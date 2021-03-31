require('dotenv').config()

const { initialize } = require('./src/initializer')

initialize({ port: process.env.PORT, host: process.env.HOST })
