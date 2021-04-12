const { parser } = require('../libs/network/protocol')

const { Pool: ClientPool } = require('../libs/client')

module.exports = async (client, socket, datapacket) => {
  const data = parser.char_update.parse(datapacket)
  const state = JSON.parse(data.state)

  // TODO: run validation on each attribute and parameter to prevent cheating
  client.charState = state
  client.lastCharStateUpdate = Date.now().toString()

  client.character.values = {
    ...client.character.values,
    hp: state.attributes.hp,
    stamina: state.attributes.stamina,
  }

  ClientPool.getInstance().update(client)
}
