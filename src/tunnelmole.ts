import { initialiseClientId } from './identity/client-id-service.js';
import { Options } from './options.js';
import { initStorage } from './node-persist/storage.js';
import { eventHandler, URL_ASSIGNED } from './events/event-handler.js';
import { setUpAutoReconnect } from './websocket/setup-auto-reconnect.js';
import { connect } from './websocket/connect.js';

export default async function tunnelmole(options: Options): Promise<string> {
    await initStorage();
    await initialiseClientId();

    // Set port to 3000 if port is not specified
    if (options.port === undefined) {
        options.port = 3000;
    }

    if (options.setApiKey) {
        return;
    }

    const websocket = connect(options);
    setUpAutoReconnect(options.domain, connect, websocket);

    // Return the URL as soon as its assigned
    return new Promise((resolve) => {
        eventHandler.on(URL_ASSIGNED, (url: string) => {
            resolve(url);
        })
    });
}