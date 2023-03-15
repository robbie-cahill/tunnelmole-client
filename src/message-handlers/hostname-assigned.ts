import HostnameAssignedMessage from '../messages/hostname-assigned-message.js';
import HostipWebSocket from '../websocket/host-ip-websocket.js';
import { Options } from '../options.js';

export default async function hostnameAssigned(message: HostnameAssignedMessage, websocket: HostipWebSocket, options: Options) {
    const port = options.port;

    if (typeof port === 'undefined') {
        console.error('Please specify a port e.g. run "hostip tmole 80"');
    }

    console.info("http://" + message.hostname + " is forwarding to localhost:" + port);
    console.info("https://" + message.hostname + " is forwarding to localhost:" + port);
}