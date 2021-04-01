const bcrypt = require('bcrypt')

const checkUserPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password)
}

module.exports = {
  checkUserPassword
}
