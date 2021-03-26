const now = require('performance-now');
const packet = require('./network/packet');

class Client {
  
  constructor(socket) {
    this.socket = socket;
  }

  initialize() {
    const client = this;

    client.socket.write(packet.build(["HANDSHAKE", now().toString()]))

    console.log('client initiated')
  }

  onData(data) {
    console.log("Client data received", data.toString())
  }

  onError(err) {
    console.log("Client error", err)
  }

  onEnd() {
    console.log("Client closed")
  }
}

module.exports = Client
