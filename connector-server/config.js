require('dotenv').config()
const args = require('minimist')(process.argv.slice(2))

const env = args.env || 'local'

const config = {
  env,
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  database: {
    uri: process.env.DATABASE_URI
  }
}

module.exports = config
