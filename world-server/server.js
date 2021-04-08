const config = require('./config')
const { initialize: serverInitializer } = require('./src/initializer')
const { initialize: databaseInitializer } = require('./src/database')
const WorldQueues = require('./src/queue')
const ClientPool = require('./src/network/client-pool')
const SocketPool = require('./src/network/socket-pool')
const { posUpdateHandle, charUpdateHandle } = require('./src/queue-handles')
const redis = require('redis')

const { server, database, redis: {host: redisHost, port: redisPort} } = config

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort
})

const sharedRedisConfig = {
  redis: redisClient
}

console.log('[GAMEWORLD] Initializing server ...')
module.exports = (async () => {

  try {
    // Create pools first
    // TODO: not working. Need further investigation
    // ClientPool.create(redisClient)
    // SocketPool.create()

    await databaseInitializer(database)
    await serverInitializer(server, redisClient)

    // Create queues
    const config = {
      ...sharedRedisConfig,
      removeOnSuccess: true,
      removeOnFailure: true,
    }
    await WorldQueues.createQueue("POS_UPDATE_Q", posUpdateHandle, config)
    await WorldQueues.createQueue("CHAR_UPDATE_Q", charUpdateHandle, config)
  } catch (err) {
    console.error("Error while trying to initialize server", err)
    throw err
  }
})()
