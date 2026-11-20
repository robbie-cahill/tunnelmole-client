import http from 'http';

interface LocalResponse
{
    statusCode: number,
    headers: http.IncomingHttpHeaders,
    body: Buffer
}

// Used to clean up requests to a local service that accepts a connection but never responds
const DEFAULT_TIMEOUT_IN_MILLISECONDS = 120_000;

/**
 * Sends a request to a service running on the local machine and resolves with the raw response.
 *
 * Deliberately uses the `http` module instead of a higher level client (node-fetch, axios) so that
 * headers and bodies pass through untouched. Higher level clients follow redirects and decode or
 * re-encode bodies by default, which a tunnel must not do.
 */
const requestLocal = async (
    requestOptions : http.RequestOptions,
    base64Body = '',
    timeoutInMilliseconds = DEFAULT_TIMEOUT_IN_MILLISECONDS
) : Promise<LocalResponse> => {
    const response = await sendRequest(requestOptions, base64Body, timeoutInMilliseconds);

    return {
        statusCode: response.statusCode ?? 502,
        headers: response.headers,
        body: await readBody(response)
    };
}

const sendRequest = (
    requestOptions : http.RequestOptions,
    base64Body : string,
    timeoutInMilliseconds : number
) : Promise<http.IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const request = http.request(requestOptions, resolve);

        request.on('error', reject);

        request.setTimeout(timeoutInMilliseconds, () => {
            request.destroy(new Error(`The local service did not respond within ${timeoutInMilliseconds}ms`));
        });

        request.end(base64Body === '' ? undefined : Buffer.from(base64Body, 'base64'));
    });
}

const readBody = async (response : http.IncomingMessage) : Promise<Buffer> => {
    const chunks : Buffer[] = [];

    // Collects the body once and propagates stream errors, unlike concatenating in a 'data' handler
    for await (const chunk of response) {
        chunks.push(chunk as Buffer);
    }

    return Buffer.concat(chunks);
}

export { requestLocal, LocalResponse };
