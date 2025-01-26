
/*
 * Handle automatic reconnection if a custom subdomain is used. Use a delay with exponential backoff.
 */
import log from "../logging/log.js";
import HostipWebSocket from "./host-ip-websocket";

const setUpAutoReconnect = (
    domain: string|undefined, 
    connect: CallableFunction, 
    websocket: HostipWebSocket
) => {
    // We can only reliably reconnect custom subdomains. Otherwise you'd get another random subdomain on reconnection
    if (typeof domain !== 'string') {
        return;
    }

    let reconnectAttempts = 0;
    const maxReconnectDelay = 30000; // Maximum delay of 30 seconds
    const baseReconnectDelay = 1000; // Start with 1 second

    const attemptReconnection = (connect: CallableFunction) => {
        reconnectAttempts += 1;
        const reconnectDelay = Math.min(baseReconnectDelay * Math.pow(2, reconnectAttempts - 1), maxReconnectDelay);
        setTimeout(() => {
            log(`Got disconnected, attempting to reconnect... `, "warning");
            connect();
        }, reconnectDelay);
    };

    // Every 6 hours, reset reconnectAttempts. This should keep reconnections fast for long lived connections.
    setInterval(() => {
        reconnectAttempts = 0;
    }, 21600000);


    // Set up the websocket connection to auto reconnect
    websocket.on('close', () => {
        attemptReconnection(connect);
    });
}

export { setUpAutoReconnect }