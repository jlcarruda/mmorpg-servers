const { User, Character } = require('../../models')
const { startingTown } = require('../../game/maps')

module.exports = (app) => {
  app.post('/signup', async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400).json({
        message: "Missing parameters"
      })

      return next()
    }

    try {
      const user = await User.register(username, password)
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
}


async function createMockCharacter(user) {
  if (user.character.lenght === 0) {
    const { x, y } = startingTown.entryPoints.filter(e => e.id === 'ep_start_point')[0]
    await user.setCharacter(Character.create({
      name: "Character01",
      position: {
        x,
        y,
        current_room: startingTown.room
      }
    }))
  }
}
