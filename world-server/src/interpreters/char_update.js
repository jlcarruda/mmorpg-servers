const packet = require('../network/packet')
const ClientPool = require('../network/client-pool')
const Parser = require('../network/packet-parser')

module.exports = async (client, socket, datapacket) => {
  const data = Parser.char_update.parse(datapacket)
  const state = JSON.parse(data.state)

  // TODO: run validation on each attribute and parameter to prevent cheating
  client.charState = state
  client.lastCharStateUpdate = Date.now().toString()

  client.character.values = {
    ...client.character.values,
    hp: state.attributes.hp,
    stamina: state.attributes.stamina,
  }

  console.log("Saved state of character")
}
