const config = require('../../config')
const { User } = require('../../src/models')
const { sign } = require('../../src/utils/jwt')

module.exports = (app) => {
  app.post('/auth', async (req, res, next) => {
    console.log("[AUTH] - Authentication request received")
    const wrongCreds = {
      data: {
        message: "Wrong credentials"
      }
    }

    try {
      const { username, password: bodyPassword } = req.body
      const user = await User.authenticate(username, bodyPassword)
      if (!user) {
        return res.status(401).json(wrongCreds)
      } else if (user.client) {
        return res.status(401).json({
          message: "Another client is connected to this account"
        })
      } else {
        const { password, ...data } = user._doc

        const token = sign({ username: user.username, id: user._id }, )
        console.log("[AUTH] User authenticated successfully")
        return res.status(200).json({
          data,
          token,
        })
      }
    } catch (error) {
      console.error('[AUTH] Authentication failed', error)
      next(error)
    }
  })

  console.info('[AUTH] Authentication routes set!')
}
