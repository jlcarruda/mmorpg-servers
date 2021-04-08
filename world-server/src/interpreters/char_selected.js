const now = require('performance-now')
const Parser = require('../network/packet-parser')
const SocketPool = require('../network/socket-pool')
const ClientPool = require('../network/client-pool')
const { users } = require('../connectors/rest_connector')
const { Character } = require('../models')

module.exports = async (client, socket, datapacket) => {
  const { build } = require('../network/packet')
  const data = Parser.char_selected.parse(datapacket)

  const { char_id, token } = data

  try {
    const {status, data: { data: user } } = await users.getUser(client.user.id, token)
    let userHasChar = false
    user.characters.forEach(c => {
      if (JSON.stringify(c._id) === JSON.stringify(char_id)){
        userHasChar = true
      }
    })

    if (status !== 200 || !userHasChar) {
      console.error('[CHAR SELECTED] Clients user does not have acces to this character. Closing socket connection')
      socket.write(build(['CHAR_SELECTED', 'FALSE', now().toString()]))
      ClientPool.getInstance().remove(client)
      return SocketPool.getInstance().destroy(socket)
    }

    const character = await Character.findById(char_id).lean()

    client.character = character
    console.log("Character selected", character)
    socket.write(build(['CHAR_SELECTED', 'TRUE', now().toString()]))
  } catch (error) {
    throw error
  }
}
