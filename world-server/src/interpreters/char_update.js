const packet = require('../network/packet')
const ClientPool = require('../network/client-pool')
const Parser = require('../network/packet_parser')

module.exports = async (client, datapacket) => {
  const clientObj = ClientPool.getInstance().findById(client.id)
  const data = Parser.char_update.parse(datapacket)
  const state = JSON.parse(data.state)

  // TODO: run validation on each attribute and parameter to prevent cheating
  clientObj.charState = state
  clientObj.lastCharStateUpdate = Date.now().toString()

  console.log("Saved state of character")
}