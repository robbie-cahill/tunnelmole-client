import config from '../config';
import HostipWebSocket from './websocket/host-ip-websocket';
import InitialiseMessage from './messages/initialise-message';
import { initialise } from './messages/types';
import { messageHandlers } from '../message-handlers';
import log from './logging/log';
import { getClientId } from './identity/client-id-service';
import { getApiKey } from './identity/api-key-service';
import validator from 'validator';
import { Options } from './options';

export default async function tunnelmoleServer(options : Options)
{
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
                console.info("Invalid domain name passed, please use the format mydomain.tunnelmole.com");
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
}