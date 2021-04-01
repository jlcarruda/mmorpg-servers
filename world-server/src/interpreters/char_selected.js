const now = require('performance-now')
const Parser = require('../network/packet_parser')
const { destroySocket } = require('../socket')
const { users } = require('../connectors/rest_connector')

module.exports = async (client, { build }, datapacket) => {
  const data = Parser.char_selected.parse(datapacket)

  const { token, char_id } = data

  try {
    const {status, data: character } = await users.getUserCharacter(client.user.id, char_id, token)
    if (status !== 200 || !character) {
      console.error('[CHAR SELECTED] Clients user does not have acces to this character. Closing socket connection')
      client.socket.write(build(['CHAR_SELECTED', 'FALSE', now().toString()]))
      return destroySocket(client)
    }

    client.character = character.data
    console.log("Character selected", JSON.stringify(character))
    client.socket.write(build(['CHAR_SELECTED', 'TRUE', now().toString()]))
  } catch (error) {
    throw error
  }
}
