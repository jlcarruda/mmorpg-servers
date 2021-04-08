const now = require('performance-now')
const Parser = require('../network/packet-parser')
const SocketPool = require('../network/socket-pool')
const ClientPool = require('../network/client-pool')
const WorldQueues = require('../queue')

module.exports = async (client, socket, datapacket, isRunning = false) => {
  let data;
  if (!isRunning) {
    data = Parser.pos_update.parse(datapacket)
  } else {
    data = Parser.pos_update_run.parse(datapacket)
  }

  if (!client.character) {
    ClientPool.getInstance().remove(client)
    return SocketPool.getInstance().destroy(socket)
  }

  try {
    await WorldQueues.createJob('POS_UPDATE_Q', { command: isRunning ? "POS_UPDATE_RUN" : "POS_UPDATE", packet: data, client })
  } catch(err) {
    console.error("ERROR WHILE CREATING JOB", err)
  }
}
