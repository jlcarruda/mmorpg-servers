const config = require('./config')
const { initialize: serverInitializer } = require('./src/initializer')
const { initialize: databaseInitializer } = require('./src/database')

const { server, database } = config

console.log('[GAMEWORLD] Initializing server ...')
module.exports = (async () => {
  await databaseInitializer(database)
  await serverInitializer(server)
})()
