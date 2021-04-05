const now = require('performance-now')
const Parser = require('../network/packet_parser')
const { destroySocket } = require('../socket')
const config = require('../../config')
const { Character } = require('../models')
const WorldQueues = require('../queue')

module.exports.POS_UPDATE = async (client, heart, packet_parser, datapacket, isRunning = false) => {
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
    await WorldQueues.createJob('POS_UPDATE_Q', { command: isRunning ? "POS_UPDATE_RUN" : "POS_UPDATE", packet: data, client, packet_parser })
  } catch(err) {
    console.error("ERROR WHILE CREATING JOB", err)
  }
}
