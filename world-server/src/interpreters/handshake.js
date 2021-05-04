const now = require('performance-now')
const { users } = require('../connectors/rest_connector')


module.exports = async (client, socket, datapacket) => {
  const { messages, parser } = require('../libs/network/protocol')
  const { Pool: SocketPool } = require('../libs/network')
  const { Pool: ClientPool } = require('../libs/client')
  const { build } = require('../libs/network/packet')
  const data = parser.handshake.parse(datapacket)

  const { token, user_id } = data

  try {
    // Retrieve user
    const getUserResponse = await users.getUser(user_id, token)
    const { status: userResponseStatus, data: userResponseData } = getUserResponse
    const clientPool = await ClientPool.getInstance()
    if (userResponseStatus !== 200) {
      console.error(`[GAMEWORLD] Error while getting user from Rest Server. Server responded with ${userResponseStatus || 'no'} status`)
      socket.write(build([messages.HANDSHAKE_FAIL]))
      clientPool.remove(client)
      return SocketPool.getInstance().destroy(socket)
    }

    // Attach client to user
    const setClientResponse = await users.setClientToUser(user_id, client.id, token)
    const { status: clientResponseStatus } = setClientResponse
    if (clientResponseStatus !== 204) {
      console.error(`[GAMEWORLD] Error while getting user from Rest Server. Server responded with ${clientResponseStatus || 'no'} status`)
      socket.write(build([messages.HANDSHAKE_FAIL]))
      clientPool.remove(client)
      return SocketPool.getInstance().destroy(socket)
    }

    client.set('user', userResponseData.data)
    client.set('token', token)

    await clientPool.update(client) // Await so I make sure that the client is updated with user
    socket.write(build([messages.AUTHORIZED, now().toString()]))
  } catch (error) {
    throw error
  }
}

