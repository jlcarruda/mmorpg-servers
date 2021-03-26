const mongoose = require('mongoose')

const initialize = async ({ uri }) => {
  console.info("[DATABASE] Initializing DB connection ...")
  try {
    const authConn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.info("[DATABASE] DB Connected!")
    return authConn
  } catch (error) {
    console.error("[DATABASE] Error while trying to connect to database.", error)
    throw error;
  }
}

module.exports = {
  initialize
}
