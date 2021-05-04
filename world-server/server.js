const config = require('./config')
const database = require('./src/libs/database')
const Queues = require('./src/libs/queues')
const socketServer = require('./src/initializers/socket')
const { charPersistHandle, posUpdateHandle } = require('./src/handles')
const { getClient } = require('./src/repositories/redis')
const { Pool: ClientPool } = require('./src/libs/client')

const { server, database: dbConfigs, queue: queueConfig } = config

module.exports = (async () => {
  try {
    await ClientPool.create()
    await database.connect(dbConfigs)
    await getClient()

    const queues = Queues.getInstance()

    await queues.createQueue('POS_UPDATE_Q', posUpdateHandle, { interval: 100 })
    // queues.createQueue('CHAR_UPDATE_Q', () => {}, queueConfig)
    await queues.createQueue('CHAR_PERSIST_Q', charPersistHandle, { interval: 0 })
    await socketServer.start(server)
  } catch (err) {
    console.error("[GAMEWORLD] Error while trying to initialize server", err)
    throw err
  }
})()
