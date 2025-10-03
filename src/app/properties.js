// Application properties
import Cookies from "universal-cookie";
import {serverAddressCookie} from "./constants";

const version = import.meta.env.VITE_APP_VERSION
const minimumServerVersion = '0.4.0'
const apiVersion = 'v1'
const websocketRoot = `/api/${apiVersion}/ws`
const websocketUrl = websocketRoot + '/stomp'
const cookies = new Cookies()
const serverCookie = cookies.get(serverAddressCookie)

const printHeader = _ => {
    console.log(
        '---\n',
        `Ⓜ Matchday Dashboard v${version} © Tomás Gray\n`,
        '[note] minimum dashboard requirements:\n',
        `  ⦿ server version: ${minimumServerVersion}\n`,
        `  ⦿ API version: ${apiVersion}\n`,
        '---'
    )
}

export const properties = {
    version,
    minimumServerVersion,
    primaryColor: '#6e86ff',
    baseUrl: serverCookie,
    websocketRoot,
    websocketUrl: `${serverCookie}${websocketUrl}`,
}

export default properties

printHeader()