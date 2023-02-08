import HostnameAssignedMessage from '../messages/hostname-assigned-message';
import config from '../../config';
import HostipWebSocket from '../websocket/host-ip-websocket';
import { Command } from 'commander';

export default async function hostnameAssigned(message: HostnameAssignedMessage, websocket: HostipWebSocket, command: Command) {
    const port = command.args[0];

    if (typeof port === 'undefined') {
        console.error('Please specify a port e.g. run "hostip tmole 80"');
    }

    if (Number.isNaN(parseInt(port))) {
        console.error('Please specify a number as the port, you passed in ' + port);
    }

    console.info("http://" + message.hostname + " is forwarding to localhost:" + port);
    console.info("https://" + message.hostname + " is forwarding to localhost:" + port);
}