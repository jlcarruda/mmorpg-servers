const mongoose = require('mongoose')

const initialize = async ({ uri }) => {
  console.info("Initializing DB connection ...")
  try {
    const authConn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.info("DB Connected!")
    return authConn
  } catch (error) {
    console.error("Error while trying to connect to database.", error)
    throw error;
  }
}

module.exports = {
  initialize
}
