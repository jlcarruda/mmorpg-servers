let client;

/**
 * Retrieves the client of a repository that is used for queues
 * @param {boolean} newClient - Defaults to false. Tell if it will create a new client and overwrite
 */
const getClient = async (newClient = false, overwriteClient = true) => {
  console.log(`[REDIS] Retrieving new Redis client. Client already exists? ${client !== undefined}`)
  if(!newClient && client) {
    console.log('[REDIS] Client already created')
    return client
  }
  const Redis = require('ioredis')
  const config = require('../../config')
  const { redis: { url, config: redisConfig } } = config

  try {
    const redisClient = new Redis(url, redisConfig)
    await redisClient.connect()

    if (!client || (client && overwriteClient)) {
      client = redisClient
    }
    return client
  } catch(err) {
    console.error('[REDIS] Error trying to create or connect client', err)
    throw err
  }
}

module.exports = {
  getClient
}
