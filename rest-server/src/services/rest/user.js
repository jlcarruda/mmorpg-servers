const isAuthenticated = require('./middlewares/is_user_authenticated')
const mongoose = require('mongoose')
const { Character, User } = require('../../models')

module.exports = (app) => {

  app.get('/users/:userId', isAuthenticated, async (req, res, next) => {
    try {
      return res.status(200).json({
        data: res.locals.auth
      })
    } catch(err) {
      console.error('[REST] An error has ocurred on /users/:userId route', err)
      next(err)
    }
  })

  app.post('/users/:userId/logout', isAuthenticated, async (req, res, next) => {
    console.log('[REST] Loggin out user (Unattach client)')
    const { auth: user } = res.locals
    const { client_id } = req.body

    try {
      const checkUser = await User.findById(user.id)
      if (checkUser.client === client_id) {
        checkUser.client = ""

        await checkUser.save()
      }

      res.status(200)

    } catch (err) {
      console.error('Error while logging out client', err)
      res.status(500)
    }
    next()
  })

  app.post('/users/:userId/client', isAuthenticated, async (req, res, next) => {
    console.log('[REST] Attaching client id to user')
    const { auth: user } = res.locals
    const { client_id } = req.body

    try {
      const checkUser = await User.findOne({ client: client_id })

      if (checkUser && JSON.stringify(checkUser._id) !== JSON.stringify(user.id)) {
        console.error('[REST] Client already registered to another user')
        res.status(403).json({
          message: 'Forbidden'
        })
      } else {
        await User.findByIdAndUpdate(user.id, {
          client: client_id
        })
        console.log('[REST] Client associated with user successfully')
        return res.status(204).send()
      }

      next()
    } catch(err) {
      console.error('[REST] Error while attaching client to user', err)
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
