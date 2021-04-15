require('dotenv').config()
const args = require('minimist')(process.argv.slice(2))
const package = require('./package.json')

const env = args.env || "local"

const config = {
  encryption: {
    jwt: {
      secret: process.env.JWT_SECRET,
      // expiresIn: process.env.JWT_EXPIRATION
    }
  },
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    uri: process.env.DATABASE_URI
  }
}

module.exports = config

