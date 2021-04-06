const config = require('./config')
const { initialize: serverInitializer } = require('./src/initializer')
const { initialize: databaseInitializer } = require('./src/database')
const WorldQueues = require('./src/queue')
const { posUpdateHandle, charUpdateHandle } = require('./src/queue-handles')

const { server, database } = config

console.log('[GAMEWORLD] Initializing server ...')
module.exports = (async () => {

  try {
    await databaseInitializer(database)

    await serverInitializer(server)
    // Create queues
    const config = {
      removeOnSuccess: true,
      removeOnFailure: true,
      sendEvents: false,
      storeJobs: false
    }
    await WorldQueues.createQueue("POS_UPDATE_Q", posUpdateHandle, config)
    await WorldQueues.createQueue("CHAR_UPDATE_Q", charUpdateHandle, config)
  } catch (err) {
    console.err("Error while trying to initialize server", err)
    throw err
  }

})()
