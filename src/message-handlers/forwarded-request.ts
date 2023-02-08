import HostipWebSocket from "../websocket/host-ip-websocket";
import ForwardedRequestMessage from "../messages/forwarded-request-message";
import http from 'http';
import { Command } from "commander";
import ForwardedResponseMessage from "../messages/forwarded-response-message";
import { forwardedResponse } from "../messages/types";
import log from "../logging/log";

export default async function forwardedRequest(forwardedRequestMessage: ForwardedRequestMessage, websocket: HostipWebSocket, command : Command) {
    const port = Number.parseInt(command.args[0]);
    const { requestId, url, headers } = forwardedRequestMessage;

    // @todo: Once GET is working, add support for all HTTP methods
    const options : http.RequestOptions = {
        hostname: 'localhost',
        method: forwardedRequestMessage.method,
        port: port,
        path: url,
        headers
    };

    const request = http.request(options, (response : http.IncomingMessage) => {
        let responseBody : Buffer;
        response.on('data', (chunk: Buffer) => {
            if (typeof responseBody === 'undefined') {
                responseBody = chunk;
            } else {
                responseBody = Buffer.concat([responseBody, chunk]);
            }
        });

        /**
         * If you see this callback being called more than once, this is probably normal especially if a browser initiated the request
         * Most browsers will make more than one request, for example an extra one for favicon.ico
         */
        response.on('end', () => {
            //@ts-ignore
            const forwardedResponseMessage : ForwardedResponseMessage = {
                type: forwardedResponse,
                requestId,
                statusCode: response.statusCode,
                url,
                headers: response.headers,
                body: ''
            }

            if (Buffer.isBuffer(responseBody)) {
                forwardedResponseMessage.body = responseBody.toString('base64');
            }

            websocket.sendMessage(forwardedResponseMessage);
        })
    });

    const requestBody : Buffer = Buffer.from(forwardedRequestMessage.body, 'base64');
    request.write(requestBody);

    request.on('error', (error : any) => {
        log(error);
    });

    request.end();
}