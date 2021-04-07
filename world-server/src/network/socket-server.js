const ClientFactory = require('../client-factory')
const net = require('net')
const ClientPool = require('./client-pool')
const SocketPool = require('./socket-pool')
const { v4: uuidv4 } = require('uuid')

let server;
const startSocketServer = (packet) => new Promise((resolve) => {
  const clientPool = ClientPool.getInstance()
  const socketPool = SocketPool.getInstance()
  if (!server) {
    console.log('[GAMEWORLD] Creating socket server ...')
    server = net.createServer(async (socket) => {
      socket.id = uuidv4()

      const client = ClientFactory.create(socket)

      socket.on("error", (err) => {
        console.log("Client error", err)
        clientPool.remove(client.id)
      })

      socket.on("end", () => {
        clientPool.remove(client.id)
      })

      socket.on("data", (data) => packet.parse(data))

      await clientPool.add(client)
      socketPool.add(socket)
    })
  }

  resolve(server)
})

module.exports = startSocketServer
