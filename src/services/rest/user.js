const authorizer = require('./middlewares/is_user_authenticated')
const { Character, User } = require('../../models')

module.exports = (app) => {

  app.get('/:user_id/characters', authorizer, async (req, res, next) => {
    const { auth: { id } } = res.locals;
    const { user_id } = req.params;
    
    try {
      if (toString(user_id) !== toString(id)) {
        res.status(403).json({
          message: "Forbidden"
        })
      } else {
        const user = await User.findById(id).select('-password').populate('characters').lean()
        
        res.status(200).json({
          data: {
            characters: user.characters || []
          }
        })
      }
  
      next()
    } catch(err) {
      console.error('[GET CHARACTERS] An error ocurred', err)
      next(err)
    }
  })

  console.info("[REST] User routes set!")
}
