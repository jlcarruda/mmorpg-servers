require('dotenv').config()

module.exports = {
  encryption: {
    jwt: process.env.JWT_SECRET
  },
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  }
}
