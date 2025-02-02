import { initialiseClientId } from './identity/client-id-service.js';
import { Options } from './options.js';
import { initStorage } from './node-persist/storage.js';
import { eventHandler, URL_ASSIGNED } from './events/event-handler.js';
import { setUpAutoReconnect } from './websocket/setup-auto-reconnect.js';
import { connect } from './websocket/connect.js';
import { setIsCli } from './websocket/connection-info-service.js';
import detectPort from 'detect-port';

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
Warning: You currently don't have anything running on port ${port}, which means you might get the standard 503 gateway timeout error when you make a request, since your service is not reachable. 

Please start your service on port ${port} so that requests can reach your service.
`
        );

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