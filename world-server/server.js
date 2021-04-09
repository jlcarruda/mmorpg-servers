const config = require('./config')
const { initialize: serverInitializer } = require('./src/initializer')
const { initialize: databaseInitializer } = require('./src/database')
const WorldQueues = require('./src/queue')
const { posUpdateHandle, charPersistHandle } = require('./src/queue-handles')
const redis = require('redis')

const { server, database, redis: {url, host: redisHost, port: redisPort} } = config

const clientConfig = url || {
  host: redisHost,
  port: redisPort
}
const redisClient = redis.createClient(clientConfig)

const sharedRedisConfig = {
  redis: redisClient
}

console.log('[GAMEWORLD] Initializing server ...')
module.exports = (async () => {

  try {

    await databaseInitializer(database)
    // Create queues
    const config = {
      ...sharedRedisConfig,
      removeOnSuccess: true,
      removeOnFailure: true,
    }
    await WorldQueues.createQueue("POS_UPDATE_Q", posUpdateHandle, config)
    // await WorldQueues.createQueue("CHAR_UPDATE_Q", charUpdateHandle, config)
    await WorldQueues.createQueue("CHAR_PERSIST_Q", charPersistHandle, config)

    await serverInitializer(server, redisClient)

  } catch (err) {
    console.error("Error while trying to initialize server", err)
    throw err
  }
})()
