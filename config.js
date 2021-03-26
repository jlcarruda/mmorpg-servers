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
  services: {
    gameworld: {
      host: process.env.GAMEWORLD_SERVER_HOST,
      port: process.env.GAMEWORLD_SERVER_PORT,
    },
    authentication: {
      host: process.env.AUTH_SERVER_HOST,
      port: process.env.AUTH_SERVER_PORT,  
    }
  },
  database: {
    uri: process.env.DATABASE_URI,
  }
}

module.exports = config

