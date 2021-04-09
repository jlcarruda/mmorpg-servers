const ClientFactory = require('../client-factory')
const net = require('net')
const ClientPool = require('./client-pool')
const SocketPool = require('./socket-pool')
const { v4: uuidv4 } = require('uuid')
const short = require('short-uuid')
const WorldQueues = require('../queue')

let server;
const startSocketServer = (packet, redisClient) => new Promise(async (resolve) => {
  const clientPool = await ClientPool.create(redisClient)
  const socketPool = SocketPool.create()
  if (!server) {
    console.log('[GAMEWORLD] Creating socket server ...')
    server = net.createServer(async (socket) => {
      socket.id = uuidv4()

      const client = ClientFactory.create(socket)

      socket.on("error", async (err) => {
        console.log("Client error", err)
        await WorldQueues.createJob("CHAR_PERSIST_Q", { client_id: client.id })
      })

      socket.on("end", async () => {
        await WorldQueues.createJob("CHAR_PERSIST_Q", { client_id: client.id })
      })

      socket.on("data", (data) => packet.parse(data))

      await clientPool.add(client)
      socketPool.add(socket)
      socket.write(packet.build(["REQUEST_HANDSHAKE", short().fromUUID(client.id)]))
    })
  }

  resolve(server)
})

module.exports = startSocketServer
