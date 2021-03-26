const startSocketServer = require('./network/socket')

const start = ({ port, host }) => new Promise(async (resolve, reject) => {
  try {
    const server = await startSocketServer()
    server.listen(port, host, () => {
      console.log(`Server initialized on port ${port}.`)
      resolve()
    })
  } catch (error) {
    console.error(`Error on starting gameworld: ${error.message}` )
    reject(error)
  }
})

module.exports = {
  startGameworld: start
}
