import ClientMessage from "../messages/client-message";

export default function clientMessage(message: ClientMessage) {
    console.info(message.message);
}

