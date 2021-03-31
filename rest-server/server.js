const config = require('./config')
const database = require('./src/initializers/database')
const { initialize: restInitialize } = require('./src/initializers/rest_server')


async function startInitializers() {
  try {
    console.log('Running server initializers ...')
    const { services: { rest, gameworld }, database: databaseConfig } = config
    await database.initialize(databaseConfig)
    await restInitialize(rest)
  } catch (err) {
    console.error('SERVER ERROR. Could not initialize services', err)
    throw err
  }
}

startInitializers()
