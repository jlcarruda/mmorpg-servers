const net = require('net')
const { v4: uuidv4 } = require('uuid')
const short = require('short-uuid')
const Queues = require('../libs/queues')
const { protocol: { messages }, packet: Packet, Pool: SocketPool } = require('../libs/network')
const { Pool: ClientPool, Factory: ClientFactory } = require('../libs/client')

let _server;
const start = ({ port, host }, packet = Packet) => new Promise(async (resolve, reject) => {
  if (!_server) {

    server = net.createServer(async (socket) => {
      const clientPool = await ClientPool.getInstance()
      const socketPool = SocketPool.create()
      socket.id = uuidv4()

      const client = ClientFactory.create(socket)

      socket.on("error", async (err) => {
        console.log("[SOCKET] Error on socket connection", err)
        await Queues.getInstance().createJob('CHAR_PERSIST_Q', {client_id: client.id}) //NOTE: client_id
      })

      socket.on("end", async () => {
        await Queues.getInstance().createJob('CHAR_PERSIST_Q', {client_id: client.id}) //NOTE: client_id
      })

      socket.on("data", (data) => packet.parse(data))

      clientPool.add(client)
      socketPool.add(socket)
      socket.write(packet.build([messages.REQUEST_HANDSHAKE, short().fromUUID(client.id)]))
    })

    server.listen(port, host, () => {
      console.log(`[GAMEWORLD] Server initialized @ ${host}:${port}.`)
      resolve()
    })
  }
})

module.exports = {
  start
}
