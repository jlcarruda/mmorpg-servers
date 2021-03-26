const config = require('./config')
const { startGameworld } = require('./src/gameworld')

async function startInitializers() {
  console.log('Running server initializers ...')
  const { services: { authentication, gameworld } } = config
  await startGameworld(gameworld)
}

startInitializers()
