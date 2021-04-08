const now = require('performance-now');
const packet = require('./network/packet');
const { v4: uuidv4 } = require('uuid')
const ClientPool = require('./network/client-pool')

class ClientFactory {
  static create(socket) {
    const client = {
      socket: socket.id,
      character: null,
      user: null,
      charState: {},
      lastCharStateUpdate: null,
      lastUpdatedAt: Date.now().toString(),
      id: uuidv4(),
    }

    return client
  }

  initialize() {
    this.socket.write(packet.build(["REQUEST_HANDSHAKE"]))
    console.log('client initiated')
  }

  onData() {
    return (data) => { packet.parse(data) }
  }

  onError() {
    const client = this;
    return (err) => {
      console.log("Client error", err)
      const pool = ClientPool.getInstance()
      pool.remove(client.id)
    }
  }

  onEnd() {
    const client = this;
    return () => {
      const pool = ClientPool.getInstance()
      pool.remove(client.id)
    }
  }
}

module.exports = ClientFactory
