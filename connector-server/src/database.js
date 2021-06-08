const mongoose = require('mongoose')

const initialize = ({ uri }) => {
  console.info('[CONNECTOR] Initializing DB connection ...')
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState == 0) {
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(() => {
        console.info('[CONNECTOR] DB Connected!')
        resolve()
      }).catch(error => {
        console.error('[CONNECTOR] Error while trying to connect to database.', error)
        reject(error)
      })
    } else {
      console.log('[CONNECTOR] DB already connected. Using existing connection')
    }
  })
}

module.exports = {
  initialize
}
