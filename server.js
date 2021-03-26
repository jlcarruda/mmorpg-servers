const config = require('./config')
const startSocketServer = require('./src/network/socket')

async function startInitializers() {
  console.log('Running server initializers ...')
  const { server: { socket, host, port } } = config
  const server = await startSocketServer(socket.corsOrigin)
  
  server.listen(port, () => {
    console.log(`Server initialized on port ${port}.`)
  })
}

startInitializers()
