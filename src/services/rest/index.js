const authentication = require('./authentication')
const healthCheck = require('./health-check')

module.exports = (app) => {
  console.info('[REST] Setting routes ...')
  authentication(app)
  healthCheck(app)
  console.info('[REST] Routes setted!')
}
