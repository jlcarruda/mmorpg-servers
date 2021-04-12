const { Character } = require('../models')
const { Pool: ClientPool } = require('../libs/client')

module.exports = async (job) => {
  const clientPool = await ClientPool.getInstance()
  const { data: { client_id } } = job
  try {
    const client = await clientPool.findById(client_id)
    if (client && client.character) {
      await Character.findByIdAndUpdate(client.character._id, client.character)
      await clientPool.remove(client.id)
    }
  } catch(err) {
    console.error('[GAMEWORLD] Error while persisting character into databse', err)
  }
}
