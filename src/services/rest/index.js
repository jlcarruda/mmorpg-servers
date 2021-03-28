const signin = require('./signin')
const register = require('./register')
const healthCheck = require('./health-check')

module.exports = (app) => {
  console.info('[REST] Setting routes ...')
  signin(app)
  register(app)
  healthCheck(app)
  console.info('[REST] Routes setted!')
}
