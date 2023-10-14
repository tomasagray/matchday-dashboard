// Application properties
import Cookies from "universal-cookie/es6";
import {serverAddressCookie} from "./constants";

const minimumServerVersion = '0.0.1-SNAPSHOT'
const websocketUrl = '/api/ws'
const version = process.env.REACT_APP_VERSION

const cookies = new Cookies()
const serverCookie = cookies.get(serverAddressCookie)

export const properties = {
    minimumServerVersion,
    baseUrl: serverCookie,
    websocketUrl: `${serverCookie}${websocketUrl}`,
    version,
}
export default properties