const now = require('performance-now')
const Parser = require('../network/packet_parser')
const { destroySocket } = require('../socket')

module.exports = async (client, { build }, datapacket) => {
  const data = Parser.char_selected.parse(datapacket)

  const { char_id } = data

  try {
    // const character = client.user.characters.filter(c => toString(c._id) === toString(char_id))[0]
    // if (!character) {
    //   console.error('[CHAR SELECTED] Clients user does not have acces to this character. Closing socket connection')
    //   client.socket.write(build(['CHAR_SELECTED', 'FALSE', now().toString()]))
    //   return destroySocket(client)
    // }

    // client.character = await Character.findById(character._id)
    // console.log("Character selected", JSON.stringify(character))
    // client.socket.write(build(['CHAR_SELECTED', 'TRUE', now().toString()]))
  } catch (error) {
    throw error
  }
}
