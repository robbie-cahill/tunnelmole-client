import HostnameAssignedMessage from '../messages/hostname-assigned-message.js';
import HostipWebSocket from '../websocket/host-ip-websocket.js';
import { Options } from '../options.js';
import { eventHandler, URL_ASSIGNED } from '../events/event-handler.js';
import chalk from 'chalk';

export default async function hostnameAssigned(message: HostnameAssignedMessage, websocket: HostipWebSocket, options: Options) {
    const port = options.port;

    if (typeof port === 'undefined') {
        console.error('Please specify a port e.g. run "tmole 80"');
    }


    const httpsUrl = `https://${message.hostname}`;
    const httpUrl = `http://${message.hostname}`;
    const destinationUrl = `http://localhost:${port}`;

    if (process.env.TUNNELMOLE_QUIET_MODE !== '1') {
        console.info('='.repeat(process.stdout.columns));
        console.info('Your URLs are below. Always use HTTPs for the best security');
        console.info('');
        console.info(`${chalk.greenBright.bold(httpsUrl)} ⟶   ${chalk.bold(destinationUrl)}`);
        console.info(`${chalk.greenBright.bold(httpUrl)} ⟶   ${chalk.bold(destinationUrl)}`);
        console.info('='.repeat(process.stdout.columns));
    }
    
    eventHandler.emit(URL_ASSIGNED, httpsUrl);
}