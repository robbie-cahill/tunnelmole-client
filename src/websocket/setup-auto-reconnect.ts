
/*
 * Handle automatic reconnection if a custom subdomain is used. Use a delay with exponential backoff.
 */
import log from "../logging/log.js";
import { Options } from "../options.js";
import HostipWebSocket from "./host-ip-websocket";

let reconnectAttempts = 0;
let isReconnecting = false;
const maxReconnectDelay = 30000; // Maximum delay of 30 seconds
const baseReconnectDelay = 1000; // Start with 1 second


// Every 6 hours, reset reconnectAttempts. This should keep reconnections fast for long lived connections.
let resetConnnectionAttemptsInterval;
const resetTheConnectionAttemptsInterval = () => {
    resetConnnectionAttemptsInterval = setInterval(() => {
        reconnectAttempts = 0;
    }, 21600000);
}

const attemptReconnection = async (connect: CallableFunction, options: Options) => {
    if (isReconnecting) return;
    isReconnecting = true;
    
    reconnectAttempts += 1;
    const reconnectDelay = Math.min(baseReconnectDelay * Math.pow(2, reconnectAttempts - 1), maxReconnectDelay);
    
    setTimeout(async () => {
        log("Got disconnected, attempting to reconnect...", "warning");
        try {
            const newWebsocket = await connect(options);
            isReconnecting = false;  
            reconnectAttempts = 0;  // Reset reconnectAttempts on successful reconnection
            setUpAutoReconnect(connect, options, newWebsocket);
        } catch (error) {
            log("Reconnection attempt failed.", "error");
            isReconnecting = false;
            attemptReconnection(connect, options);
        }
    }, reconnectDelay);
};

const setUpAutoReconnect = async(
    connect: CallableFunction,
    options: Options,
    websocket: HostipWebSocket
) => {
    // We can only reliably reconnect custom subdomains. Otherwise you'd get another random subdomain on reconnection
    if (typeof options.domain !== 'string') {
        return;
    }

    // Set up the websocket connection to auto reconnect
    websocket.on('close', () => {
        attemptReconnection(connect, options);
    });

    resetTheConnectionAttemptsInterval();
}

export { setUpAutoReconnect }