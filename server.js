const config = require('./config')
const { initialize: gameworldInitialize } = require('./src/initializers/gameworld_server')
const database = require('./src/initializers/database')
const { initialize: restInitialize } = require('./src/initializers/rest_server')


async function startInitializers() {
  try {
    console.log('Running server initializers ...')
    const { services: { rest, gameworld }, database: databaseConfig } = config
    await database.initialize(databaseConfig)
    await gameworldInitialize(gameworld)
    await restInitialize(rest)
  } catch (err) {
    console.error('SERVER ERROR. Could not initialize services', err)
    throw err
  }
}

startInitializers()
