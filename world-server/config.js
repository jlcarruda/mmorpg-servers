require('dotenv').config()

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
}
