const isAuthenticated = require('./middlewares/is_user_authenticated')
const mongoose = require('mongoose')
const { Character, User } = require('../../models')

module.exports = (app) => {

  app.get('/users/:userId', isAuthenticated, async (req, res, next) => {
    try {
      res.status(200).json({
        data: res.locals.auth
      })
    } catch(err) {
      console.error('[REST] An error has ocurred on /users/:userId route', err)
      next(err)
    }
  })

  app.get('/users/:userId/characters', isAuthenticated, async (req, res, next) => {
    console.log("[REST] Get characters requested for authenticated user")
    const { auth: user } = res.locals;
    try {

      res.status(200).json({
        data: {
          characters: user && user.characters || []
        }
      })
      next()
    } catch(err) {
      console.error('[GET USER CHARACTERS] An error ocurred', err)
      next(err)
    }
  })

  app.get('/users/:userId/characters/:charId', isAuthenticated, async (req, res, next) => {
    console.log("[REST] Get a selected character data")
    const { auth: user } = res.locals
    const { charId } = req.params

    try {
      const selected = user.characters.filter((char) => JSON.stringify(char._id) === JSON.stringify(charId))[0]
      if (!selected) {
        res.status(403).json({
          message: "Forbidden"
        })

        return next()
      }

      res.status(200).json({
        data: selected
      })

      next()
    } catch(err) {
      console.error('[GET USER SELECTED CHARACTER] An error ocurred', err)
      next(err)
    }
  })

  console.info("[REST] User routes set!")
}
