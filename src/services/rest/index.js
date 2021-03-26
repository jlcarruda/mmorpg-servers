const authentication = require('./signin')
const healthCheck = require('./health-check')

module.exports = (app) => {
  console.info('[REST] Setting routes ...')
  authentication(app)
  healthCheck(app)
  console.info('[REST] Routes setted!')
}
