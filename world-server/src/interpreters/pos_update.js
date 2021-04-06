const now = require('performance-now')
const Parser = require('../network/packet_parser')
const { destroySocket } = require('../socket')
const WorldQueues = require('../queue')

module.exports = async (client, datapacket, isRunning = false) => {
  let data;
  if (!isRunning) {
    data = Parser.pos_update.parse(datapacket)
  } else {
    data = Parser.pos_update_run.parse(datapacket)
  }

  if (!client.character) {
    return destroySocket(client)
  }

  try {
    await WorldQueues.createJob('POS_UPDATE_Q', { command: isRunning ? "POS_UPDATE_RUN" : "POS_UPDATE", packet: data, client })
  } catch(err) {
    console.error("ERROR WHILE CREATING JOB", err)
  }
}
