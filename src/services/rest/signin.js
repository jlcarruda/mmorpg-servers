const { User } = require('../../models')
const { checkUserPassword } = require('../utils/authenticate')

module.exports = (app) => {
  app.post('/auth', async (req, res, next) => {
    console.log("[AUTH] - Request received")
    const wrongCreds = {
      data: {
        message: "Wrong credentials"
      }
    }

    try {
      const { username, password: bodyPassword } = req.body
      console.log(`[AUTH] - body: ${username}  ${bodyPassword}`)
      const user = await User.authenticate(username, bodyPassword)
      if (!user) {
        return res.status(401).json(wrongCreds)
      } else {
        const { password, ...responseUser } = user
        console.log(responseUser)
        return res.status(200).json({
          data: {
            ...responseUser
          }
        })
      }
    } catch (error) {
      console.error('[REST] Authentication failed', error)
      next(error)
    }
  })

  console.info('[REST] Authentication routes set!')
}
