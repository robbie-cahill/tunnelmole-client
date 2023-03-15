import HostipWebSocket from "../websocket/host-ip-websocket.js";
import { Options } from "../options.js";

export default async function hostnameAlreadyTaken(message: any, websocket: HostipWebSocket, options: Options) {
    console.error(message.hostname + " is already taken, please choose a different hostname");
    process.exit(0);
}