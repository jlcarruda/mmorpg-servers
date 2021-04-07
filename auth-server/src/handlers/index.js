const signin = require('./signin')

module.exports = (app) => {
  console.info('[AUTH] Setting routes ...')
  signin(app)
  // register(app)
  // user(app)
  // healthCheck(app)
  console.info('[AUTH] Routes setted!')
}
