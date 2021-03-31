const config = require('./config')
const { initialize } = require('./src/initializer')

const { server } = config

console.log('[GAMEWORLD] Initializing server ...')
initialize(server)
