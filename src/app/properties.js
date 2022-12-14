// Application properties
const apiProtocol = 'http'
const websocketProtocol = 'http'
const serverAddress = '192.168.0.100'
const port = 8080
const websocketUrl = '/api/ws'

export const properties = {
  baseUrl: `${apiProtocol}://${serverAddress}:${port}`,
  websocketUrl: `${websocketProtocol}://${serverAddress}:${port}${websocketUrl}`,
}
export default properties