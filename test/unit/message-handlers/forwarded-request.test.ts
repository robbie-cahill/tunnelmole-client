import http from 'http';
import { AddressInfo } from 'net';
import forwardedRequest from '../../../src/message-handlers/forwarded-request.js';
import ForwardedRequestMessage from '../../../src/messages/forwarded-request-message.js';
import ForwardedResponseMessage from '../../../src/messages/forwarded-response-message.js';
import HostipWebSocket from '../../../src/websocket/host-ip-websocket.js';

const slowRequestDelayInMilliseconds = 300;

interface CapturedRequest
{
    method?: string,
    url?: string,
    headers: http.IncomingHttpHeaders,
    body: Buffer
}

const startServer = async (requestListener : http.RequestListener) : Promise<{ server : http.Server, port : number }> => {
    const server = http.createServer(requestListener);

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

    return {
        server,
        port: (server.address() as AddressInfo).port
    };
}

const stopServer = async (server : http.Server) : Promise<void> => {
    server.closeAllConnections();

    await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
}

const createWebSocketStub = () : { websocket : HostipWebSocket, sentMessages : ForwardedResponseMessage[] } => {
    const sentMessages : ForwardedResponseMessage[] = [];

    const websocket = {
        sendMessage: (message : ForwardedResponseMessage) => sentMessages.push(message)
    } as unknown as HostipWebSocket;

    return { websocket, sentMessages };
}

const buildForwardedRequest = (requestId : string, overrides : Partial<ForwardedRequestMessage> = {}) : ForwardedRequestMessage => {
    return {
        type: 'forwardedRequest',
        requestId,
        url: '/',
        method: 'GET',
        headers: {},
        body: '',
        ...overrides
    };
}

const waitForResponses = async (sentMessages : ForwardedResponseMessage[], count : number, timeoutInMilliseconds = 2000) : Promise<void> => {
    const started = Date.now();

    while (sentMessages.length < count) {
        if (Date.now() - started > timeoutInMilliseconds) {
            throw new Error(`Timed out waiting for ${count} responses, received ${sentMessages.length}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 10));
    }
}

describe('forwardedRequest', () => {
    let server : http.Server;
    let port : number;
    let capturedRequest : CapturedRequest;

    beforeAll(async () => {
        const started = await startServer((request, response) => {
            const chunks : Buffer[] = [];

            request.on('data', (chunk : Buffer) => chunks.push(chunk));

            request.on('end', () => {
                const body = Buffer.concat(chunks);

                if (request.url === '/slow') {
                    setTimeout(() => response.end('slow'), slowRequestDelayInMilliseconds);
                    return;
                }

                capturedRequest = {
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    body
                };

                response.writeHead(200, { 'content-type': 'application/octet-stream' });
                response.end(body);
            });
        });

        server = started.server;
        port = started.port;
    });

    afterAll(async () => {
        await stopServer(server);
    });

    it('forwards the method, path, headers and body untouched', async () => {
        const { websocket, sentMessages } = createWebSocketStub();
        const requestBody = Buffer.from([0x00, 0x01, 0xfe, 0xff]);

        forwardedRequest(buildForwardedRequest('echo', {
            url: '/some-path?query=value',
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'X-Test-Header': 'yes'
            },
            body: requestBody.toString('base64')
        }), websocket, { port });

        await waitForResponses(sentMessages, 1);

        expect(capturedRequest.method).toBe('POST');
        expect(capturedRequest.url).toBe('/some-path?query=value');
        expect(capturedRequest.headers['x-test-header']).toBe('yes');
        expect(capturedRequest.body.equals(requestBody)).toBe(true);

        expect(sentMessages[0].statusCode).toBe(200);
        expect(Buffer.from(sentMessages[0].body, 'base64').equals(requestBody)).toBe(true);
    });

    it('does not block other requests while one is in flight', async () => {
        const { websocket, sentMessages } = createWebSocketStub();
        const started = Date.now();

        forwardedRequest(buildForwardedRequest('first', { url: '/slow' }), websocket, { port });
        forwardedRequest(buildForwardedRequest('second', { url: '/slow' }), websocket, { port });

        // Handler calls are synchronous and return before either request completes
        expect(sentMessages).toHaveLength(0);

        await waitForResponses(sentMessages, 2);

        const scoredRequestIds = sentMessages.map((message) => message.requestId).sort();

        expect(scoredRequestIds).toEqual(['first', 'second']);

        // Two serialised 300ms requests would take at least 600ms
        expect(Date.now() - started).toBeLessThan(500);
    });

    it('sends a 502 when the local service is not reachable', async () => {
        const { websocket, sentMessages } = createWebSocketStub();
        const temporary = await startServer((request, response) => response.end());
        await stopServer(temporary.server);

        const originalConsoleError = console.error;
        // The connection error is expected and the handler logs it
        console.error = () => { /* silence expected error */ };

        try {
            forwardedRequest(buildForwardedRequest('offline'), websocket, { port: temporary.port });
            await waitForResponses(sentMessages, 1);
        } finally {
            console.error = originalConsoleError;
        }

        expect(sentMessages[0].statusCode).toBe(502);
        expect(Buffer.from(sentMessages[0].body, 'base64').toString()).toContain('could not get a response');
    });
});
