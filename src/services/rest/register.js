const { User, Character } = require('../../models')
const { startingTown } = require('../../game/maps')

module.exports = (app) => {
  app.post('/register', async (req, res, next) => {
    const { username, password: bodyPassword } = req.body
    if (!username || !bodyPassword) {
      res.status(400).json({
        message: "Missing parameters"
      })

      return next()
    }

    try {
      const usernameExists = await User.checkUsernameAvailability(username)
      if (usernameExists) {
        res.status("401").json({
          message: "Invalid username"
        })

        return next()
      }
      const user = await User.register(username, bodyPassword)
      await createMockCharacter(user)
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

  console.info('[REST] Register routes set!')
}


async function createMockCharacter(user) {
  if (user.characters.length === 0) {
    const { x, y } = startingTown.entryPoints.filter(e => e.id === 'ep_start_point')[0]
    try {
      const character = await Character.create({
        name: "Character01",
        position: {
          x,
          y,
          current_room: startingTown.room
        },
      })
      await user.setCharacter(character)
    } catch(err) {
      console.error("Error while creating mock character", err)
    }
  }
}
