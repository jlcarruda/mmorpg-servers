module.exports = (app) => {
  app.get('/health', (req, res, next) => {
    res.status(200).json({
      healthy: true
    })
    
    next()
  })
  console.info('[REST] Health check routes set!')
}
