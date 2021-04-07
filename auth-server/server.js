const config = require('./config')

const server = require('./src/initializer')
const database = require('./src/database')

module.exports = (async () => {
  console.log('[AUTH] Initializing server ...')
  const { database: dbConfig, server: serverConfig } = config
  await database.initialize(dbConfig)
  await server.initialize(serverConfig)
})()


