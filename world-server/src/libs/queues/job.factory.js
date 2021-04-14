const create = async (queue, data) => {
  try {
    const job = await queue.createJob(data).save()
    job.on('retrying', () => console.log('[GAMEWORLD] Retrying job '))
    job.on('succeeded', () => console.log('[GAMEWORLD] Success job '))

    return job
  } catch(err) {
    const errMessage = `[GAMEWORLD] Error while creating job on queue`
    console.error(errMessage, err)
    throw err
  }
}

module.exports = {
  create
}
