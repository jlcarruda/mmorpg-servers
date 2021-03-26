const Client = require('../client')
const net = require('net')

let server;
const startSocketServer = () => new Promise((resolve, reject) => {

  if (!server) {
    console.log('Creating socket server ...')
    server = net.createServer((socket) => {
      console.log('Socket connected')

      const client = new Client(socket)
      client.initialize()
  
      socket.on("error", client.onError)
  
      socket.on("end", client.onEnd)
  
      socket.on("data", client.onData)
    })
  }

  resolve(server)
})

module.exports = startSocketServer
