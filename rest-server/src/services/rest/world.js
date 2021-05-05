const isAuthenticated = require('./middlewares/is_user_authenticated')
const config = require('../../../config')

module.exports = (app) => {
  app.get('/world/config', isAuthenticated, async (req, res, next) => {
    console.log('[REST] Request for world configurations')
    try {
      return res.status(200).json({
        entities: {
          ...config.game.entities,
        }
      })
    } catch(err) {
      console.error('[REST] An error has ocurred on /world/config route', err)
      next(err)
    }
  })

  console.info('[REST] World routes set!')
}
