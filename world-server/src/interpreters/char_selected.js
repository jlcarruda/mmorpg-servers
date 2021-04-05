const now = require('performance-now')
const Parser = require('../network/packet_parser')
const { destroySocket } = require('../socket')
const { users } = require('../connectors/rest_connector')
const { Character } = require('../models')

module.exports = async (client, heart, { build }, datapacket) => {
  const data = Parser.char_selected.parse(datapacket)

  const { char_id, token } = data

  try {
    const {status, data: { data: user } } = await users.getUser(client.user.id, token)
    let userHasChar = false
    console.log("USER ", user)
    user.characters.forEach(c => {
      if (JSON.stringify(c._id) === JSON.stringify(char_id)){
        userHasChar = true
      }
    })

    if (status !== 200 || !userHasChar) {
      console.error('[CHAR SELECTED] Clients user does not have acces to this character. Closing socket connection')
      client.socket.write(build(['CHAR_SELECTED', 'FALSE', now().toString()]))
      return destroySocket(client)
    }

    const character = await Character.findById(char_id)

    client.character = character
    console.log("Character selected", character)
    client.socket.write(build(['CHAR_SELECTED', 'TRUE', now().toString()]))
  } catch (error) {
    throw error
  }
}
