const axios = require('axios')
const config = require('../../config')

module.exports = {
  users: {
    getUser: async (userId, token, { rest: baseUrl } = config.connectors) => {
      try {
        const response = await axios.request({
          method: 'get',
          url: `/users/${userId}`,
          baseUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        return response
      } catch(err) {
        if (err.isAxiosError) {
          console.info(`[GAMEWORLD] Bad gateway error. Rest server responded with ${err.response.status} status`)
          return {
            status: 502,
            message: "Bad Gateway"
          }
        } else {
          console.error("[GAMEWORLD] Failed to reach Rest server", err)
        }
      }
    }
  }
}
