const Client = require('../client')
const net = require('net')
const ClientPool = require('./client-pool')

let server;
const startSocketServer = () => new Promise((resolve) => {
  const pool = ClientPool.getInstance()
  if (!server) {
    console.log('[GAMEWORLD] Creating socket server ...')
    server = net.createServer((socket) => {
      console.log('[GAMEWORLD] Socket connected')

      const client = new Client(socket)
      client.initialize()

      socket.on("error", client.onError())

      socket.on("end", client.onEnd())

      socket.on("data", client.onData())

      pool.add(client)
    })
  }

  resolve(server)
})

module.exports = startSocketServer
