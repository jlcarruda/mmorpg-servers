require('dotenv').config()
const args = require('minimist')(process.argv.slice(2))
const maps = require('./src/game/maps')
const package = require('./package.json')

const env = args.env || "local"

const config = {
  game: {
    starting_zone: "rm_start",
    maps
  },
  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    env,
    socket: {
      corsOrigin: process.env.CORS_ORIGIN
    },
    version: package.version,
  },
  database: {
    uri: process.env.DATABASE_URI,
  }
}

module.exports = config

