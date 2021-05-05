require('dotenv').config()
const args = require('minimist')(process.argv.slice(2))
const entities = require('./src/game/entities')

const env = args.env || "local"

const config = {
  encryption: {
    jwt: {
      secret: process.env.JWT_SECRET,
    }
  },
  game: {
    entities,
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

