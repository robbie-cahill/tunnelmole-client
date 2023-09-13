import config from '../config.js';
import HostipWebSocket from './websocket/host-ip-websocket.js';
import InitialiseMessage from './messages/initialise-message.js';
import { initialise } from './messages/types.js';
import { messageHandlers } from '../message-handlers.js';
import log from './logging/log.js';
import { getClientId, initialiseClientId } from './identity/client-id-service.js';
import { getApiKey, setApiKey } from './identity/api-key-service.js';
import { Options } from './options.js';
import validator from 'validator';
import { initStorage } from './node-persist/storage.js';
import { eventHandler, URL_ASSIGNED } from './events/event-handler.js';

export default async function tunnelmole(options : Options): Promise<string>
{
    await initStorage();
    await initialiseClientId();

    // Set port to 3000 if port is not specified
    if (options.port === undefined) {
        options.port = 3000;
    }

    if (options.setApiKey) {
       return;
    }

    const websocket = new HostipWebSocket(config.hostip.endpoint);
    const websocketIsReady = websocket.readyState === 1;

    const sendInitialiseMessage = async () => {
        log("Sending initialise message");

        const initialiseMessage : InitialiseMessage = {
            type: initialise,
            clientId: await getClientId()
        };

        // Set api key if we have one available
        const apiKey = await getApiKey();
        if (typeof apiKey === 'string') {
            initialiseMessage.apiKey = apiKey;
        }

        // Handle passed subdomain param if present
        let domain = options.domain ?? undefined;
        if (typeof domain === 'string') {
            // Remove protocols in case they were passed by mistake as the "domain"
            domain = domain.replace('http://', '');
            domain = domain.replace('https://', '');

            if (!validator.isURL(domain)) {
                console.info("Invalid domain name passed, please use the format mydomain.tunnelmole.net");
                return Promise.resolve();
            }

            const domainParts = domain.split('.');
            const subdomain = domainParts[0];

            initialiseMessage.subdomain = subdomain;
        }

        websocket.sendMessage(initialiseMessage);
    }

    // There seems to be a bug where on a second run, the websocket is re-used and is in a ready state
    // Send initialise message now if this is the case, otherwise set the open event to trigger the initialise message
    if (websocketIsReady) {
        sendInitialiseMessage();
    } else {
        websocket.on('open', sendInitialiseMessage);
    }

    websocket.on('message', (text : string) => {
        const message = JSON.parse(text);

        if (typeof message.type !== 'string') {
            console.error("Invalid message, type is missing or invalid");
        }

        // Errors should be handled in the handler itself. If it gets here it will be thrown.
        if (typeof messageHandlers[message.type] !== 'function') {
            console.error("Handler not found for message type " + message.type);
        }

        const handler = messageHandlers[message.type];

        handler(message, websocket, options);
    });

    // Log messages if debug is enabled
    websocket.on('message', (text: string) => {
        const message = JSON.parse(text);
        log(Date.now() + " Received " + message.type + " message:", "info");
        log(message, 'info');
    });

    // Log errors
    websocket.on('error', (error) => {
        log(Date.now() + "Caught an error:", "error");
        console.error(error);
    });

    // Listen for the URL assigned event and return it
    return new Promise((resolve) => {
        eventHandler.on(URL_ASSIGNED, (url: string) => {
            resolve(url);
        })
    });
}