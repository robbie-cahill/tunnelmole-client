import { Command } from 'commander';
import config from '../config';
import HostipWebSocket from './websocket/host-ip-websocket';
import InitialiseMessage from './messages/initialise-message';
import { initialise } from './messages/types';
import { messageHandlers } from '../message-handlers';
import log from './logging/log';
import { getClientId } from './identity/client-id-service';
import { getApiKey } from './identity/api-key-service';
import validator from 'validator';

export default async function tmoleServer(command : Command)
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
        const AS = command.args[1] || undefined; // uppercase variable name to stop conflict with JavaScript reserved word "as"
        let domain = command.args[2] || undefined;
        if (typeof domain === 'string') {
            domain = domain.replace('http://', '');
            domain = domain.replace('https://', '');

            if (!validator.isURL(domain)) {
                console.info("Invalid domain name passed, please enter the format mydomain.tmole.sh");
                return Promise.resolve();
            }

            const domainParts = domain.split('.');
            const subdomain = domainParts[0];

            if (AS === 'as' && !domain) {
                console.info('Please enter your desired domain e.g. "hostip tmole 80 as myapp.hostip.dev"');
            }

            if (AS === 'as' && domain) {
                initialiseMessage.subdomain = subdomain;
            }
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

        handler(message, websocket, command);
    });

    // Log messages if debug is enabled
    websocket.on('message', (text: string) => {
        const message = JSON.parse(text);
        log(Date.now() + " Received " + message.type + " message:", "info");
        log(message, 'info');
    });
}