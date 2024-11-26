import ClientMessage from "../messages/client-message";

export default function clientMessage(message: ClientMessage) {
    switch (message.logLevel ?? "info") {
        case "info":
            console.info(message.message);
            break;
        case "warn":
            console.warn(message.message);
            break;
        case "error":
            console.error(message.message);
            break;
        default: 
            console.info(message.message);
            break;
    }
}

