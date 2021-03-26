const config = require('./config')
const { startGameworld } = require('./src/gameworld')
const database = require('./src/initializers/database')

async function startInitializers() {
  console.log('Running server initializers ...')
  const { services: { gameworld }, database: databaseConfig } = config
  await database.initialize(databaseConfig)
  await startGameworld(gameworld)
}

startInitializers()
