const register = require('./register')
const healthCheck = require('./health-check')
const user = require('./user')
const world = require('./world')

module.exports = (app) => {
  console.info('[REST] Setting routes ...')
  register(app)
  user(app)
  healthCheck(app)
  world(app)
  console.info('[REST] Routes setted!')
}
