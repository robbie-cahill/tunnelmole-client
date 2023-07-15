import hostnameAssigned from "./src/message-handlers/hostname-assigned.js";
import forwardedRequest from "./src/message-handlers/forwarded-request.js";
import hostnameAlreadyTaken from "./src/message-handlers/hostname-already-taken.js";
import invalidSubscription from "./src/message-handlers/invalid-subscription.js";
import HostipWebSocket from "./src/websocket/host-ip-websocket.js";

/**
 * Websocket message handlers for different message types
 * Like app.ts for express, but with handlers for different message types instead of URLs
 */
const messageHandlers = {
  hostnameAssigned,
  forwardedRequest,
  hostnameAlreadyTaken,
  invalidSubscription,
  WebSocketCloseMessage,
  WebSocketOpenMessage,
  WebSocketHostMessage,
  WebSocketClientMessage,
}
export { messageHandlers }

function WebSocketCloseMessage(message, websocket, options) {
  if (!websocket.sockets) return console.log('WebSocketCloseMessage impossible')

  const { socketId, code, data } = message
  console.log('me', message)
  const found = websocket.sockets.get(socketId)
  console.log('found', found?.readyState)
  if (found.readyState === 1) found?.close(code, data)
}

function WebSocketOpenMessage(forwardedRequestMessage, websocket, options) {
  const port = options.port
  const { socketId, url, headers } = forwardedRequestMessage
  // console.log('WebSocketOpenMessage', 'ws://127.0.0.1:' + port + url, headers)

  delete headers['sec-websocket-key']
  delete headers['sec-websocket-extensions']

  // Create end to end tunnel
  if (!websocket.sockets) websocket.sockets = new Map()
  const datatunnel = new HostipWebSocket('ws://127.0.0.1:' + port + url, {
    headers,
  })
  websocket.sockets.set(socketId, datatunnel)

  // Forward messages from client to server
  // console.log('WebSocketOpenMessage.ready', datatunnel.readyState)
  datatunnel.on('open', () => {
    // console.log('WebSocketOpenMessage.open', datatunnel.readyState)
  })
  datatunnel.on('message', (data) => {
    const message = { type: 'WebSocketClientMessage', socketId, data }
    websocket.sendMessage(message)
  })
  datatunnel.on('close', () => {
    const close = { type: 'WebSocketCloseMessage', socketId }
    websocket.sendMessage(close)
  })
}

async function WebSocketHostMessage(
  forwardedRequestMessage,
  websocket,
  options
) {
  // console.log('WebSocketHostMessage')
  if (!websocket.sockets) {
    // console.log('no sockets, wait')
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  if (!websocket.sockets) return // console.log('bummer')

  const { socketId, data } = forwardedRequestMessage
  const datatunnel = websocket.sockets.get(socketId)
  // console.log('datatunnel', datatunnel.readyState)
  if (!datatunnel) return // console.log('no datatunnel')
  datatunnel.send(data)
}

function WebSocketClientMessage() {
  console.log('WebSocketClientMessage impossible?')
}
