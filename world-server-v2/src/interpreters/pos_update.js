const now = require('performance-now')

const { Pool: SocketPool } = require('../libs/network')
const { parser } = require('../libs/network/protocol')
const { Pool: ClientPool } = require('../libs/client')
const Queues = require('../libs/queues')

module.exports = async (client, socket, datapacket, isRunning = false) => {
  let data;
  if (!isRunning) {
    data = parser.pos_update.parse(datapacket)
  } else {
    data = parser.pos_update_run.parse(datapacket)
  }

  if (!client.character) {
    const clientPool = await ClientPool.getInstance()
    await clientPool.remove(client)
    return SocketPool.getInstance().destroy(socket)
  }

  try {
    await Queues.getInstance().createJob('POS_UPDATE_Q', { command: isRunning ? "POS_UPDATE_RUN" : "POS_UPDATE", packet: data, clientId: client.id })
  } catch(err) {
    console.error("ERROR WHILE CREATING JOB", err)
  }
}
