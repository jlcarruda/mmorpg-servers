if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const maps = require('./src/game/maps')

module.exports = {
  encryption: {
    jwt: process.env.JWT_SECRET
  },
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  game: {
    starting_zone: process.env.STARTING_ZONE_ROOM_NAME,
    maps,
    movement_max_desync: process.env.MOVEMENT_DESYNC_PACKET_THRESHOLD,
    tile_size: process.env.MOVEMENT_TILE_SIZE,
  },
  connectors: {
    rest: process.env.REST_SERVER
  },
  database: {
    uri: process.env.DATABASE_URI,
    configs: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    }
  },
  queue: {
    removeOnSuccess: true,
    removeOnFailure: true,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_TLS_URL,
    config: {
      // tls: {
      //   rejectUnauthorized: false
      // },
      lazyConnect: true
    }
  }
}
