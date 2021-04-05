const startSocketServer = require('./network/socket-server')
// const Gameheart = require('./game/gameheart')
const ClientPool = require('./network/client-pool')

const initialize = ({ port, host }) => startSocketServer().then(server => {
  server.listen(port, host, () => {
    console.log(`[GAMEWORLD] Server initialized @ ${host}:${port}.`)
    ClientPool.create()
    // Gameheart.create(100, 60, 10)
  })
}).catch(error => {
  console.error(`[GAMEWORLD] Error on starting gameworld: ${error.message}` )
})


module.exports = {
  initialize
}
