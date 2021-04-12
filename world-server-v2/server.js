const config = require('./config')
const database = require('./src/libs/database')

const { server, database: dbConfigs } = config

module.exports = (async () => {
  await database.connect(dbConfigs)
  // Create redis client
  // create queues
  // initialize socket server
})()

// const config = require('./config')
// const { initialize: serverInitializer } = require('./src/initializer')
// const { initialize: databaseInitializer } = require('./src/database')
// const createRedisClient = require('./src/redis')
// const WorldQueues = require('./src/queue')
// const { posUpdateHandle, charPersistHandle } = require('./src/queue-handles')

// const { server, database } = config
// console.log("Configs Initialized", JSON.stringify(config))
// console.log('[GAMEWORLD] Initializing server ...')
// module.exports = (async () => {

//   try {
//     // const redisClient =  new Redis(redisPort, redisHost, { password }) //redis.createClient(clientConfig)
//     const redisClient = await createRedisClient()

//     const sharedRedisConfig = {
//       redis: redisClient
//     }

//     await databaseInitializer(database)
//     // Create queues
//     const config = {
//       ...sharedRedisConfig,
//       removeOnSuccess: true,
//       removeOnFailure: true,
//     }
//     await WorldQueues.createQueue("POS_UPDATE_Q", posUpdateHandle, config)
//     // await WorldQueues.createQueue("CHAR_UPDATE_Q", charUpdateHandle, config)
//     await WorldQueues.createQueue("CHAR_PERSIST_Q", charPersistHandle, config)

//     await serverInitializer(server, redisClient)

//   } catch (err) {
//     console.error("Error while trying to initialize server", err)
//     throw err
//   }
// })()
