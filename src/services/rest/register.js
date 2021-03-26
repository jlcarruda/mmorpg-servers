const { User } = require('../../models')

module.exports = (app) => {
  app.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({
        message: "Missing parameters"
      })

      return next()
    }

    try {
      const user = await User.register(username, password)
      const { password, ...responseUser } = user
      res.status(201).json({
        data: responseUser
      })

      next()
    } catch (error) {
      console.error('[REST] Error while trying to register user', error)
      next(error)
    }
  })
}
