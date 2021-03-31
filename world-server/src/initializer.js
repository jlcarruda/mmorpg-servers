const startSocketServer = require('./network/socket-server')

const initialize = ({ port, host }) => startSocketServer().then(server => {
  server.listen(port, host, () => {
    console.log(`[GAMEWORLD] Server initialized @ ${host}:${port}.`)
  })
}).catch(error => {
  console.error(`[GAMEWORLD] Error on starting gameworld: ${error.message}` )
})


module.exports = {
  initialize
}
