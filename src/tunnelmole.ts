import { initialiseClientId } from './identity/client-id-service.js';
import { Options } from './options.js';
import { initStorage } from './node-persist/storage.js';
import { eventHandler, URL_ASSIGNED } from './events/event-handler.js';
import { setUpAutoReconnect } from './websocket/setup-auto-reconnect.js';
import { connect } from './websocket/connect.js';
import { setIsCli } from './websocket/connection-info-service.js';
import detectPort from 'detect-port';
import chalk from 'chalk';

export default async function tunnelmole(
    options: Options,
    isCli = false
): Promise<string> {
    await initStorage();
    await initialiseClientId();
    setIsCli(isCli);

    const { port } = options;

    // Set port to 3000 if port is not specified
    if (port === undefined) {
        options.port = 3000;
    }

    if (options.setApiKey) {
        return "We are simply setting the API key here. No need to set up a tunnel";
    }

    const availablePort = await detectPort(options.port);
    if (availablePort == options.port) {
        console.warn(
`
${chalk.yellow.bold(`
    You currently don't have anything running on port ${port}`)}. 
    
    For Tunnelmole to work, you'll need to start your service on port ${chalk.bold(port)} so that requests from the internet can reach your service, then restart Tunnelmole. 
    
    You may have also chosen the wrong port, in which case, find out what port your service is actually running on and start Tunnelmole with that port instead.
`
        );

        process.exit(1);
    }

    const websocket = await connect(options);

    // Set up auto reconnect
    setUpAutoReconnect(options, websocket);

    // Return the URL as soon as its assigned
    return new Promise((resolve) => {
        eventHandler.on(URL_ASSIGNED, (url: string) => {
            resolve(url);
        })
    });
}