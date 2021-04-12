const { Character } = require('../models')
const ClientPool = require('../network/client-pool')

module.exports = async (job) => {
  const clientPool = ClientPool.getInstance()
  const { data: { client_id } } = job
  try {
    const client = await clientPool.findById(client_id)
    if (client) {
      await Character.findByIdAndUpdate(client.character._id, client.character)
      await clientPool.remove(client.id)
    }
  } catch(err) {
    console.error('[GAMEWORLD] Error while persisting character into databse', err)
  }
}
