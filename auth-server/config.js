require('dotenv').config()

module.exports = {
  database: {
    uri: process.env.DATABASE_URI
  },
  server: {
    port: process.env.PORT,
    host: process.env.HOST
  },
  encryption: {
    jwt: {
      secret: process.env.JWT_SECRET
    }
  }
}
