const now = require('performance-now');
const packet = require('./network/packet');
const { v4: uuidv4 } = require('uuid')
const ClientPool = require('./network/client-pool')

class Client {
  constructor(socket) {
    this.socket = socket;
    this.character = null;
    this.user = null;
    this.charState = {};
    this.lastCharStateUpdate = null;
    this.id = uuidv4()
  }

  initialize() {
    this.socket.write(packet.build(["REQUEST_HANDSHAKE"]))
    console.log('client initiated')
  }

  onData() {
    const client = this;
    return (data) => { packet.parse(client, data) }
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

module.exports = Client
