const mongoose = require('mongoose')

const initialize = ({ uri }) => {
  console.info("[DATABASE] Initializing DB connection ...")
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.info("[DATABASE] DB Connected!")
      resolve()
    }).catch(error => {
      console.error("[DATABASE] Error while trying to connect to database.", error)
      reject(error)
    })
  })
}

module.exports = {
  initialize
}
