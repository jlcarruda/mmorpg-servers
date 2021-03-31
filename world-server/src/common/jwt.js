const { sign, verify } = require('jsonwebtoken')
const { encryption: { jwt } } = require('../../config')

module.exports.sign = (data, { secret, expiresIn } = jwt) => {
  const token = sign(data, secret)

  return token;
}

module.exports.verify = (encoded, { secret } = jwt) => {
  try {
    const decoded = verify(encoded, secret)
    return decoded;
  } catch(err) {
    console.error("Error while verifying token", err)
  }
}
