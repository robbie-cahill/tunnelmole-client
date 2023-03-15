import hostnameAssigned from "./src/message-handlers/hostname-assigned";
import forwardedRequest from "./src/message-handlers/forwarded-request";
import hostnameAlreadyTaken from "./src/message-handlers/hostname-already-taken";
import invalidSubscription from "./src/message-handlers/invalid-subscription";

/**
 * Websocket message handlers for different message types
 * Like app.ts for express, but with handlers for different message types instead of URLs
 */
const messageHandlers = {
    hostnameAssigned,
    forwardedRequest,
    hostnameAlreadyTaken,
    invalidSubscription
}

export { messageHandlers };