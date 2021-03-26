const { User } = require('../../models')

module.exports = (app) => {
  app.post('/auth', async (req, res, next) => {
    try {
      const { username, password } = req.body
      const user = await User.authenticate(username, password)

      if (!user) {
        res.status(401).json({
          data: {
            message: "Wrong credentials"
          }
        })
      } else {
        const { password, ...responseUser } = user
        res.status(200).json({
          data: {
            ...responseUser
          }
        })
      }

      next()
    } catch (error) {
      console.error('[REST] Authentication failed', error)
      next(error)
    }
  })

  console.info('[REST] Authentication routes set!')
}
