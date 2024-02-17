import WebSocket from 'ws';

export default class HostipWebSocket extends WebSocket
{
    constructor(endpoint: string) {
        super(endpoint);
    }

    sendMessage(object: unknown) {
        const json = JSON.stringify(object);
        this.send(json);
    }
}