const now = require('performance-now')
const packetParser = require('../network/packet')
const ClientPool = require('../network/client-pool')

const pool = ClientPool.getInstance()

module.exports = async (job) => {
  const { client: { id }, command, packet } = job.data
  const client = pool.findById(id)

  // TODO: Implement the char update command
}
