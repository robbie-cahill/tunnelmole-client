import HostipWebSocket from "../websocket/host-ip-websocket.js"
import ForwardedRequestMessage from "../messages/forwarded-request-message.js"
import ForwardedResponseMessage from "../messages/forwarded-response-message.js"
import { forwardedResponse } from "../messages/types.js"
import log from "../logging/log.js"
import { Options } from "../options.js";
import chalk from 'chalk';
import { requestLocal } from "../http/local-request.js";
import { getStatusString } from "../http/status.js";

/**
 * Forwarded requests are handled asynchronously, but this function is intentionally synchronous.
 *
 * The websocket message loop must keep dispatching other requests while this one is in flight.
 * If anything in the dispatch path awaited this handler, the tunnel would send one request at a
 * time and a slow response from the local service would hold up every other request.
 */
export default function forwardedRequest(forwardedRequestMessage: ForwardedRequestMessage, websocket: HostipWebSocket, options : Options) {
    void forwardToLocalServer(forwardedRequestMessage, options).then(
        (responseMessage) => sendResponse(websocket, responseMessage),
        (error) => {
            log(toLogString(error), 'error');
            sendResponse(websocket, buildErrorResponse(forwardedRequestMessage, 502));
        }
    );
}

const forwardToLocalServer = async (forwardedRequestMessage : ForwardedRequestMessage, options : Options) : Promise<ForwardedResponseMessage> => {
    const { requestId, url, headers, method } = forwardedRequestMessage;

    if (typeof options.port !== 'number') {
        throw new Error('Cannot forward request: no local port was configured');
    }

    const response = await requestLocal({
        hostname: 'localhost',
        method,
        port: options.port,
        path: url,
        headers
    }, forwardedRequestMessage.body);

    const userAgentString = headers['User-Agent'] || "";
    console.info(`${getStatusString(response.statusCode)} ${chalk.bold.white(`${method} ${url}`)} ${userAgentString}`)

    return {
        type: forwardedResponse,
        requestId,
        url,
        statusCode: response.statusCode,
        headers: response.headers,
        body: response.body.toString('base64')
    };
}

/**
 * The service expects exactly one response per request. If the local service can't be reached,
 * send a 502 rather than leaving the public request hanging.
 */
const buildErrorResponse = (forwardedRequestMessage : ForwardedRequestMessage, statusCode : number) : ForwardedResponseMessage => {
    const { requestId, url } = forwardedRequestMessage;
    const body = 'Tunnelmole could not get a response from the local service. Check that the service is running and listening on the expected port.';

    return {
        type: forwardedResponse,
        requestId,
        url,
        statusCode,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
        body: Buffer.from(body).toString('base64')
    };
}

const sendResponse = (websocket : HostipWebSocket, responseMessage : ForwardedResponseMessage) => {
    try {
        websocket.sendMessage(responseMessage);
    } catch (error) {
        // The websocket can close while a request is in flight
        log(toLogString(error), 'error');
    }
}

const toLogString = (error : unknown) : string => {
    return error instanceof Error ? error.stack ?? error.message : String(error);
}
