const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const errors = require('common-errors')
const routes = require('../services/rest')

const initialize = ({ host, port }) => new Promise((resolve, reject) => {
  console.info('[REST] Initializing Rest server ...')
  try {
    const app = express()

    app.use(cors())

    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(helmet())
    app.use(errors.middleware.crashProtector())

    routes(app)

    app.listen(port, host, () => {
      console.info(`[REST] Server initialized @ ${host}:${port}`)
      resolve()
    })
  } catch (error) {
    console.error('[REST] Server failed to initialize', error)
    reject(error)
  }
})

module.exports = {
  initialize
}
