let _instance;
class SocketPool {

  static create() {
    if (!_instance) {
      _instance = new SocketPool()
      _instance.pool = []
    }

    return _instance
  }

  static getInstance() {
    return _instance || SocketPool.create()
  }

  get(id) {
    return this.pool.filter(s => s.id === id)[0]
  }

  add(socket) {
    this.pool.push(socket)
  }

  destroy(id) {
    let index = null;
    let socket = null
    this.pool.every((s, i) => {
      if (s.id === id) {
        index = i
        socket = s
        return false
      }

      return true
    })

    if (index !== null) {
      console.info(`[GAMEWORLD] Removing socket ${id} from pool`)
      this.pool.slice(index, 1)
      destroySocket(socket)
    } else {
      console.info(`[GAMEWORLD] Socket with ${id} id does not exist in pool`)
    }
  }
}

function destroySocket(socket, retries = 0) {
  // First check if socket was destroyed
  if (!socket.destroyed) socket.destroy()

  // After attempting to destroy it, check again for retry
  if (!socket.destroyed) {
    if (retries === 5) {
      console.error('[SOCKET] Unable to destroy socket connection. Crashing ...')
      throw new Error("Zombie socket")
    }
    console.error(`[SOCKET] Error while trying to destroy connection. Retry ${retries + 1} out of 5`)
    setTimeout(() => destroySocket(socket, retries + 1), 5000)
  } else {
    console.info("[SOCKET] Socket destroyed successfully")
  }
}

module.exports = SocketPool
