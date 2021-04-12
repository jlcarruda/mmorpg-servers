const now = require('performance-now')
const { Pool: SocketPool } = require('../libs/network')
const { parser, messages } = require('../libs/network/protocol')
const { Pool: ClientPool  } = require('../libs/client')
const { users } = require('../connectors/rest_connector')

const { Character } = require('../models')

module.exports = async (client, socket, datapacket) => {
  const { build } = require('../network/packet')
  const data = parser.char_selected.parse(datapacket)

  const { char_id, token } = data

  try {
    const {status, data: { data: user } } = await users.getUser(client.user.id, token)
    let userHasChar = false
    user.characters.forEach(c => {
      if (JSON.stringify(c._id) === JSON.stringify(char_id)){
        userHasChar = true
      }
    })

    const clientPool = ClientPool.getInstance()

    if (status !== 200 || !userHasChar) {
      console.error('[CHAR SELECTED] Clients user does not have acces to this character. Closing socket connection')
      socket.write(build([messages.CHAR_SELECTED, 'FALSE', now().toString()]))
      clientPool.remove(client)
      return SocketPool.getInstance().destroy(socket)
    }

    // const character = await Character.findById(char_id).lean()

    // client.character = character
    await clientPool.update(client)
    // console.log("Character selected", character)
    socket.write(build([messages.CHAR_SELECTED, 'TRUE', now().toString()]))
  } catch (error) {
    throw error
  }
}
