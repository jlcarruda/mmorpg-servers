const startSocketServer = require('./network/socket-server')
// const Gameheart = require('./game/gameheart')
const packet = require('./network/packet')

const initialize = ({ port, host }) => startSocketServer(packet).then(server => {
  server.listen(port, host, () => {
    console.log(`[GAMEWORLD] Server initialized @ ${host}:${port}.`)
    // Gameheart.create(100, 60, 10)
  })
}).catch(error => {
  console.error(`[GAMEWORLD] Error on starting gameworld: ${error.message}` )
  throw error
})


module.exports = {
  initialize
}
