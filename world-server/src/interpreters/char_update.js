const packet = require('../network/packet')
const ClientPool = require('../network/client-pool')
const Parser = require('../network/packet-parser')

module.exports = async (client, datapacket) => {
  const clientObj = ClientPool.getInstance().findById(client.id)
  const data = Parser.char_update.parse(datapacket)
  const state = JSON.parse(data.state)

  // TODO: run validation on each attribute and parameter to prevent cheating
  clientObj.charState = state
  clientObj.lastCharStateUpdate = Date.now().toString()

  clientObj.character.values = {
    ...clientObj.character.values,
    hp: state.attributes.hp,
    stamina: state.attributes.stamina,
  }

  console.log("Saved state of character")
}
