import HostipWebSocket from "../websocket/host-ip-websocket.js"
import ForwardedRequestMessage from "../messages/forwarded-request-message.js"
import http from 'http';
import ForwardedResponseMessage from "../messages/forwarded-response-message.js"
import { forwardedResponse } from "../messages/types.js"
import log from "../logging/log.js"
import { Options } from "../options.js";
import chalk from 'chalk';
import { HTTP_STATUS_MESSAGES } from "../http/constants.js";

export default async function forwardedRequest(forwardedRequestMessage: ForwardedRequestMessage, websocket: HostipWebSocket, options : Options) {
    const port = options.port;
    const { requestId, url, headers, method } = forwardedRequestMessage;
    const userAgentString = headers['User-Agent'] || "";

    // @todo: Once GET is working, add support for all HTTP methods
    const requestOptions : http.RequestOptions = {
        hostname: 'localhost',
        method,
        port,
        path: url,
        headers
    };

    const request = http.request(requestOptions, (response : http.IncomingMessage) => {
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


            console.info(`${getStatusString(response.statusCode)} ${chalk.bold.white(`${method} ${url}`)} ${userAgentString}`)
            websocket.sendMessage(forwardedResponseMessage);
        })
    });

    // Send the request body if its not empty
    if (forwardedRequestMessage.body !== '') {
        const requestBody : Buffer = Buffer.from(forwardedRequestMessage.body, 'base64');
        request.write(requestBody);
    }

    request.on('error', (error : any) => {
        log(error);
    });

    request.end();
}

const getStatusString = (statusCode: number): string => {
    const message = HTTP_STATUS_MESSAGES[statusCode] || 'Unknown status code';
    
    let formattedMessage: string;
  
    if (statusCode >= 100 && statusCode < 200) {
        // Informational responses: Blue
        formattedMessage = chalk.blue.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 200 && statusCode < 300) {
        // Successful responses: Green
        formattedMessage = chalk.green.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 300 && statusCode < 400) {
        // Redirection messages: Cyan
        formattedMessage = chalk.cyan.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 400 && statusCode < 500) {
        // Client errors: Yellow
        formattedMessage = chalk.yellow.bold(`[${statusCode} ${message}]`);
    } else if (statusCode >= 500 && statusCode < 600) {
        // Server errors: Red
        formattedMessage = chalk.redBright.bold(`[${statusCode} ${message}]`);
    } else {
        // Fallback: White
        formattedMessage = chalk.white.bold(`[${statusCode} ${message}]`);
    }
    
    return formattedMessage;
};