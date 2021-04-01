const { User } = require('../../../models')
const { verify } = require('../../utils/jwt')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers

  try {
    if (!authorization) {
      return res.status(403).json({
        message: "Forbidden"
      })
    } else {
      const token = authorization.split(" ")[1]
      if (!token) {
        return res.status(403).json({
          message: "Forbidden"
        })
      }

      const { id, username } = verify(token)

      // If a user is trying to access data from another user
      if (req.params.userId && id !== req.params.userId) {
        return res.status(403).json({
          message: "Forbidden"
        })
      }

      const user = await User.findById(id).select('-password').populate('characters').lean()

      if (user && user.username === username) {
        const { _id, ...userRetrieved } = user

        res.locals.auth = { ...userRetrieved, id: _id }
      } else {
        return res.status(401).json({
          data: {
            message: "Unauthorized"
          }
        })
      }

      next()
    }
  } catch(err) {
    console.error(`[AUTHORIZER] Error while trying to authorize request: ${err.message}`, err)
    next(err)
  }
}
