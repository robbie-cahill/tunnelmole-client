import http from 'http';
import { AddressInfo } from 'net';
import { requestLocal } from '../../../src/http/local-request.js';

const slowRequestDelayInMilliseconds = 300;

const startServer = async (requestListener: http.RequestListener) : Promise<{ server : http.Server, port : number }> => {
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

describe('requestLocal', () => {
    let server : http.Server;
    let port : number;

    beforeAll(async () => {
        const started = await startServer((request, response) => {
            const chunks : Buffer[] = [];

            request.on('data', (chunk : Buffer) => chunks.push(chunk));

            request.on('end', () => {
                switch (request.url) {
                    case '/slow':
                        setTimeout(() => response.end('slow'), slowRequestDelayInMilliseconds);
                        break;
                    case '/teapot':
                        response.writeHead(418, { 'x-custom': 'teapot' });
                        response.end('short and stout');
                        break;
                    case '/never':
                        // Intentionally never responds
                        break;
                    default:
                        response.writeHead(201, { 'x-test-header': 'yes' });
                        response.end(Buffer.concat(chunks));
                }
            });
        });

        server = started.server;
        port = started.port;
    });

    afterAll(async () => {
        await stopServer(server);
    });

    it('preserves binary request and response bodies', async () => {
        const body = Buffer.from([0x00, 0x01, 0x7f, 0xfe, 0xff]);

        const response = await requestLocal({
            hostname: '127.0.0.1',
            port,
            method: 'POST',
            path: '/echo'
        }, body.toString('base64'));

        expect(response.statusCode).toBe(201);
        expect(response.headers['x-test-header']).toBe('yes');
        expect(response.body.equals(body)).toBe(true);
    });

    it('returns non-2xx status codes and headers unchanged', async () => {
        const response = await requestLocal({
            hostname: '127.0.0.1',
            port,
            method: 'GET',
            path: '/teapot'
        });

        expect(response.statusCode).toBe(418);
        expect(response.headers['x-custom']).toBe('teapot');
        expect(response.body.toString()).toBe('short and stout');
    });

    it('runs requests concurrently instead of one at a time', async () => {
        const requestOptions : http.RequestOptions = {
            hostname: '127.0.0.1',
            port,
            method: 'GET',
            path: '/slow'
        };

        const started = Date.now();

        const responses = await Promise.all([
            requestLocal(requestOptions),
            requestLocal(requestOptions),
            requestLocal(requestOptions)
        ]);

        const elapsed = Date.now() - started;
        const bodies = responses.map((response) => response.body.toString());

        expect(bodies).toEqual(['slow', 'slow', 'slow']);

        // Three serialised 300ms requests would take at least 900ms
        expect(elapsed).toBeLessThan(600);
    });

    it('rejects when the connection is refused', async () => {
        const temporary = await startServer((request, response) => response.end());
        await stopServer(temporary.server);

        await expect(requestLocal({
            hostname: '127.0.0.1',
            port: temporary.port,
            method: 'GET',
            path: '/'
        })).rejects.toThrow();
    });

    it('rejects when the local service never responds', async () => {
        await expect(requestLocal({
            hostname: '127.0.0.1',
            port,
            method: 'GET',
            path: '/never'
        }, '', 50)).rejects.toThrow(/did not respond/);
    });
});
