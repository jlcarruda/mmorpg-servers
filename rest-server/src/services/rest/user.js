const isAuthenticated = require('./middlewares/is_user_authenticated')
const { Character, User } = require('../../../../auth-server/src/models')

function checkUserId(req, res, next) {
  if (!res.locals.auth) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }

  const { auth: { id } } = res.locals;
  const { userId } = req.params;

  if (toString(userId) !== toString(id)) {
    return res.status(403).json({
      message: "Forbidden"
    })
  }

  next()
}

module.exports = (app) => {

  app.get('/users/:userId', isAuthenticated, checkUserId, async (req, res, next) => {
    try {
      res.status(200).json({
        data: res.locals.auth
      })
    } catch(err) {
      console.error('[REST] An error has ocurred on /users/:userId route', err)
      next(err)
    }
  })

  app.get('/users/:userId/characters', isAuthenticated, checkUserId, async (req, res, next) => {
    try {
      const user = await User.findById(id).select('-password').populate('characters').lean()
      res.status(200).json({
        data: {
          characters: user && user.characters || []
        }
      })
      next()
    } catch(err) {
      console.error('[GET CHARACTERS] An error ocurred', err)
      next(err)
    }
  })

  console.info("[REST] User routes set!")
}
