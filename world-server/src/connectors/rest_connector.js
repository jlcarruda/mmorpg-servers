const axios = require('axios')
const config = require('../../config')

let restClient;
let authClient;

function getRestClient() {
  if (!restClient) {
    restClient = axios.create({
      baseUrl: config.connectors.rest
    })
  }

  return restClient
}

// function getAuthClient() {
//   if (!authClient) {
//     authClient = axios.create({
//       baseUrl: config.connectors.rest
//     })
//   }

//   return authClient
// }

module.exports = {
  users: {
    getUser: async (userId, token, { rest: baseUrl } = config.connectors) => {
      try {
        const response = await getRestClient().get(`${baseUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        return response
      } catch(err) {
        if (err.isAxiosError) {
          console.error(`[GAMEWORLD] Bad gateway error. Rest server responded with ${err.response && err.response.status || 'no' } status`, err)
          return {
            status: 502,
            message: "Bad Gateway"
          }
        } else {
          console.error("[GAMEWORLD] Failed to reach Rest server", err)
          throw err;
        }
      }
    },
    getUserCharacter: async (userId, charId, token, { rest: baseUrl } = config.connectors) => {
      try {
        const response = await getRestClient().get(`${baseUrl}/users/${userId}/characters/${charId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        return response;
      } catch(err) {
        if (err.isAxiosError) {
          console.error(`[GAMEWORLD] Bad gateway error. Rest server responded with ${err.response && err.response.status || 'no' } status`, err)
          return {
            status: 502,
            message: "Bad Gateway"
          }
        } else {
          console.error("[GAMEWORLD] Failed to reach Rest server", err)
          throw err;
        }
      }
    },
    setClientToUser: async (userId, client_id, token, { rest: baseUrl } = config.connectors) => {
      try {
        const response = await getRestClient().post(`${baseUrl}/users/${userId}/client`, {
          data: {
            client_id,
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        return response
      } catch(err) {
        if (err.isAxiosError) {
          console.error(`[GAMEWORLD] Bad gateway error. Rest server responded with ${err.response && err.response.status || 'no' } status`, err)
          return {
            status: 502,
            message: "Bad Gateway"
          }
        } else {
          console.error("[GAMEWORLD] Failed to reach Rest server", err)
          throw err;
        }
      }
    }
  }
}
