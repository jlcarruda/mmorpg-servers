const mongoose = require('mongoose')

const connect = ({ uri, configs }) => {
  console.info("[GAMEWORLD] Initializing DB connection ...")
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, configs).then(() => {
      console.info("[GAMEWORLD] DB Connected!")
      resolve()
    }).catch(error => {
      console.error("[GAMEWORLD] Error while trying to connect to database.", error)
      reject(error)
    })
  })
}

module.exports = {
  connect
}
