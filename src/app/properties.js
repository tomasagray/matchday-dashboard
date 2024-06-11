// Application properties
import Cookies from "universal-cookie/es6";
import {serverAddressCookie} from "./constants";

const version = process.env.REACT_APP_VERSION
const minimumServerVersion = '0.2.0'
const apiVersion = 'v1.0'
const apiRoot = '/api/' + apiVersion
const websocketRoot = apiRoot + '/ws'
const websocketUrl = websocketRoot + '/stomp'

const cookies = new Cookies()
const serverCookie = cookies.get(serverAddressCookie)

export const properties = {
    version,
    minimumServerVersion,
    primaryColor: '#6e86ff',
    baseUrl: serverCookie,
    apiRoot,
    websocketRoot,
    websocketUrl: `${serverCookie}${websocketUrl}`,
}
export default properties