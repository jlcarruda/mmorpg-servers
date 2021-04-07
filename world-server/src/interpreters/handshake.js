const now = require('performance-now')
const Parser = require('../network/packet-parser')
const { users } = require('../connectors/rest_connector')

module.exports = async (client, datapacket, { build }) => {
  const data = Parser.handshake.parse(datapacket)

  const { token, user_id } = data

  try {
    const response = await users.getUser(user_id, token)
    const { status, data: responseData } = response
    if (status !== 200) {
      console.error(`[GAMEWORLD] Error while getting user from Rest Server. Server responded with ${status || 'no'} status`)
      console.log(responseData)
      client.socket.write(build(["HANDSHAKE_FAIL"]))
      return destroySocket(client)
    }

    client.user = responseData.data
    client.token = token



    client.socket.write(build(['AUTHORIZED', now().toString()]))
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
