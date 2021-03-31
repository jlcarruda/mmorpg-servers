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

module.exports.destroySocket = destroySocket
