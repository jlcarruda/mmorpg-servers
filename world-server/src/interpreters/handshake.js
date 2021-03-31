const now = require('performance-now')
const { verify } = require('../common/jwt')
const Parser = require('../network/packet_parser')
// const { User } = require('../../models')

module.exports = async (client, { build }, datapacket) => {
  const data = Parser.handshake.parse(datapacket)
  const decoded = verify(data.token)

  if (!decoded) {
    client.socket.write(packet.build(["HANDSHAKE_FAIL"]))
    return destroySocket(client)
  }

  const { username, id } = decoded

  try {
    // const user = await User.findById(id).select('-password').populate('characters').lean()
    // if (!user || user.username !== username) {
    //   console.error('[HANDSHAKE] User not found. Closing socket connection')
    //   return destroySocket(client)
    // }

    // client.user = user
    // client.socket.write(build(['AUTHORIZED', now().toString()]))
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
