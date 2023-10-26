import WebSocket from 'ws';

export default class HostipWebSocket extends WebSocket
{
    sendMessage(object: unknown) {
        const json = JSON.stringify(object);
        this.send(json);
    }
}