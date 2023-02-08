import HostipWebSocket from "../websocket/host-ip-websocket";
import { Command } from "commander";

export default async function hostnameAlreadyTaken(message: any, websocket: HostipWebSocket, command: Command) {
    console.error(message.hostname + " is already taken, please choose a different hostname");
    process.exit(0);
}