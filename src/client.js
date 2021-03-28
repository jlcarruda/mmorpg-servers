const now = require('performance-now');
const packet = require('./network/packet');

class Client {
  
  constructor(socket) {
    this.socket = socket;
  }

  initialize() {
    this.self = this;

    this.self.socket.write(packet.build(["REQUEST_HANDSHAKE"]))

    console.log('client initiated')
  }

  onData() {
    const client = this;
    return (data) => { packet.parse(client, data) }
  }

  onError(err) {
    console.log("Client error", err)
  }

  onEnd() {
    console.log("Client closed")
  }
}

module.exports = Client
