const now = require('performance-now')

const { Pool: SocketPool } = require('../libs/network')
const { messages, parser } = require('../libs/network/protocol')
const { users } = require('../connectors/rest_connector')

module.exports = async (client, socket, datapacket) => {
  const { build } = require('../network/packet')
  const data = parser.handshake.parse(datapacket)

  const { token, user_id } = data

  try {
    const response = await users.getUser(user_id, token)
    const { status, data: responseData } = response
    const clientPool = ClientPool.getInstance()
    if (status !== 200) {
      console.error(`[GAMEWORLD] Error while getting user from Rest Server. Server responded with ${status || 'no'} status`)
      socket.write(build([messages.HANDSHAKE_FAIL]))
      clientPool.remove(client)
      return SocketPool.getInstance().destroy(socket)
    }

    client.user = responseData.data
    client.token = token
    await clientPool.update(client) // Await so I make sure that the client is updated with user
    socket.write(build([messages.AUTHORIZED, now().toString()]))
  } catch (error) {
    throw error
  }
}

