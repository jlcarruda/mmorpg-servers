const net = require('net')
const { v4: uuidv4 } = require('uuid')
const short = require('short-uuid')
const Queues = require('../libs/queues')
const { messages } = require('../libs/network/protocol')
const Packet = require('../libs/network/packet')
const { Pool: ClientPool, Factory: ClientFactory } = require('../libs/client')

let _server;
const start = ({ port, host }, packet = Packet) => new Promise(async (resolve, reject) => {
  if (!_server) {

    const clientPool = ClientPool.getInstance()
    //TODO: create socket pool
    server = net.createServer(async (socket) => {
      socket.id = uuidv4()

      const client = ClientFactory.create(socket)

      socket.on("error", async (err) => {
        console.log("[SOCKET] Error on socket connection", err)
        await Queues.getInstance().createJob('CHAR_PERSIST_Q', {client_id: client.id}) //NOTE: client_id
      })

      socket.on("end", async () => {
        await Queues.getInstance().createJob('CHAR_PERSIST_Q', {client_id: client.id}) //NOTE: client_id
      })

      socket.on("data", (data) => packet.parse(data)) //NOTE: packet parser

      clientPool.add(client)
      //TODO: add the socket to pool
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
