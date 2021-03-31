const now = require('performance-now')
const { verify } = require('../common/jwt')
const Parser = require('../network/packet_parser')
const { users } = require('../connectors/rest_connector')

module.exports = async (client, { build }, datapacket) => {
  const data = Parser.handshake.parse(datapacket)
  // const decoded = verify(data.token)

  // if (!decoded) {
  //   client.socket.write(packet.build(["HANDSHAKE_FAIL"]))
  //   return destroySocket(client)
  // }

  const { token, id } = data

  try {
    const { status, data: responseData } = users.getUser(id, token)
    if (status !== 200) {
      console.error("[GAMEWORLD] Error while getting user from Rest Server")
      return client.socket.write(packet.build(["HANDSHAKE_FAIL"]))
    }

    client.user = responseData.data
    client.socket.write(build(['AUTHORIZED', now().toString()]))
    // const user = await User.findById(id).select('-password').populate('characters').lean()
    // if (!user || user.username !== username) {
    //   console.error('[HANDSHAKE] User not found. Closing socket connection')
    //   return destroySocket(client)
    // }

  } catch (error) {
    throw error
  }
}


function destroySocket(client, retries = 0) {
  client.socket.destroy()
  if (!client.socket.destroyed) {
    if (retries === 5) {
      console.error('[SOCKET] Unable to destroy socket connection. Crashing ...')
      throw new Error("Zombie socket")
    }
    console.error(`[SOCKET] Error while trying to destroy connection. Retry ${retries + 1} out of 5`)
    setTimeout(() => destroySocket(client, retries + 1), 5000)
  } else {
    console.info("[SOCKET] Socket destroyed successfully")
  }
}
