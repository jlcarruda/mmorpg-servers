const config = require('./config')
const { initialize: databaseInitialize } = require('./src/initializers/database')
const { initialize: restInitialize } = require('./src/initializers/rest_server')


async function startInitializers() {
  try {
    console.log('Running server initializers ...')
    const { server: serverConfig, database: databaseConfig } = config
    await databaseInitialize(databaseConfig)
    await restInitialize(serverConfig)
  } catch (err) {
    console.error('SERVER ERROR. Could not initialize services', err)
    throw err
  }
}

startInitializers()
