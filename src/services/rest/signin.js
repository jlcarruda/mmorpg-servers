const { User } = require('../../models')
const { sign } = require('../utils/encrypt')

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
        
        const token = sign({ username: user.username, id: user._id })
        console.log(`[TOKEN] ${token}`)
        return res.status(200).json({
          data: {
            ...responseUser
          },
          token,
        })
      }
    } catch (error) {
      console.error('[REST] Authentication failed', error)
      next(error)
    }
  })

  console.info('[REST] Authentication routes set!')
}
