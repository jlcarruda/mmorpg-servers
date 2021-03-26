const authentication = require('./authentication')

module.exports = (app) => {
  console.info('[REST] Setting routes ...')
  authentication(app)
  console.info('[REST] Routes setted!')
}
