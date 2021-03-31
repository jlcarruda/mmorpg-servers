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


      res.locals.auth = {
        id,
        username,
      }
  
      next()
    }
  } catch(err) {
    console.error(`[AUTHORIZER] Error while trying to authorize request: ${err.message}`, err)
    next(err)
  }
}
