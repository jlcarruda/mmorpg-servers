const bcrypt = require('bcrypt')

const encrypt = (data) => {
  return bcrypt.hashSync(data, 10)
}

console.log(encrypt('123123'))
