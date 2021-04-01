const mongoose = require('mongoose')

const initialize = ({ uri }) => {
  console.info("[REST] Initializing DB connection ...")
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState == 0) {
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.info("[REST] DB Connected!")
        resolve()
      }).catch(error => {
        console.error("[REST] Error while trying to connect to database.", error)
        reject(error)
      })
    } else {
      console.log("[REST] DB already connected. Using existing connection")
    }
  })
}

module.exports = {
  initialize
}
