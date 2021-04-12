const net = require('net')
const { getClient } = require('../repositories/redis')
const { v4: uuidv4 } = require('uuid')
const short = require('short-uuid')
const Queues = require('../libs/queues')
const { messages } = require('../libs/network/protocol')
const Packet = require('../libs/network/packet')

let _server;
const start = ({ port, host }, packet = Packet, poolStorageClient = getClient()) => new Promise(async (resolve, reject) => {
  if (!_server) {
    //TODO: create client pool
    //TODO: create socket pool
    server = net.createServer(async (socket) => {
      socket.id = uuidv4()

      //TODO: create Client Factory

      socket.on("error", async(err) => {
        console.log("[SOCKET] Error on socket connection", err)
        Queues.getInstance().createJob('CHAR_PERSIST_Q', {}) //NOTE: client_id
      })

      socket.on("end", async() => {
        Queues.getInstance().createJob('CHAR_PERSIST_Q', {}) //NOTE: client_id
      })

      socket.on("data", async(data) => packet.parse(data)) //NOTE: packet parser

      //TODO: add the client to pool
      //TODO: add the socket to pool
      //TODO: write on socket the packet builted with REQUEST_HANDSHAKE
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
