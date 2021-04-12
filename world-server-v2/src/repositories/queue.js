let client;

module.exports = async (newClient = false) => {
  console.log(`[REDIS] Retrieving new Redis client. Client already exists? ${client !== undefined}`)
  if(!newClient && client) {
    console.log('[REDIS] Client already created')
    return client
  }
  const Redis = require('ioredis')
  const config = require('../config')
  const { redis: { url, config: redisConfig } } = config

  // const clientConfig = {
  //   host: redisHost,
  //   port: redisPort,
  //   auth_pass: password,
  //   password,
  // }

  try {
    const redisClient = new Redis(url, redisConfig)
    await redisClient.connect()
    console.log(`[REDIS] Client connected to ${url}`)
    client = redisClient
    return client
  } catch(err) {
    console.error('[REDIS] Error trying to create or connect client', err)
    throw err
  }
}
