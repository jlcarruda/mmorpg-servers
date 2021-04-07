const ClientFactory = require('../client-factory')
const net = require('net')
const ClientPool = require('./client-pool')

let server;
const startSocketServer = (packet) => new Promise((resolve) => {
  const pool = ClientPool.getInstance()
  if (!server) {
    console.log('[GAMEWORLD] Creating socket server ...')
    server = net.createServer(async (socket) => {
      console.log('[GAMEWORLD] Socket connected')

      const client = ClientFactory.create(socket)
      await pool.add(client)

      socket.on("error", (err) => {
        console.log("Client error", err)
        pool.remove(client.id)
      })

      socket.on("end", () => {
        pool.remove(client.id)
      })

      socket.on("data", (data) => packet.parse(data))
    })
  }

  resolve(server)
})

module.exports = startSocketServer
