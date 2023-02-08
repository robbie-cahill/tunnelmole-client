import WebSocket from 'ws';

export default class HostipWebSocket extends WebSocket
{
    sendMessage(object : any) {
        const json = JSON.stringify(object);
        this.send(json);
    }
}