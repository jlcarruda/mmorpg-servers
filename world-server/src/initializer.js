const startSocketServer = require('./network/socket-server')
const Gameheart = require('./game/gameheart')

const initialize = ({ port, host }) => startSocketServer().then(server => {
  server.listen(port, host, () => {
    console.log(`[GAMEWORLD] Server initialized @ ${host}:${port}.`)
    Gameheart.create(100, 60, 10)
  })
}).catch(error => {
  console.error(`[GAMEWORLD] Error on starting gameworld: ${error.message}` )
})


module.exports = {
  initialize
}
